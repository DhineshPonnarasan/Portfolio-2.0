import { NextRequest, NextResponse } from 'next/server';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import {
    ArchitectureMode,
    buildConceptualArchitectureExplanation,
    findProject,
    generateArchitecturePrompt,
    generateArchitectureExplanation,
} from '@/lib/architecture';
import { getGroqClient, logAiError } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { readJsonBody, requireString, describeRouteError } from '@/lib/api-helpers';

function toMode(value: string | undefined): ArchitectureMode {
    if (value === 'data' || value === 'deployment') return value;
    return 'overview';
}

export async function POST(req: NextRequest) {
    try {
        const limited = applyRateLimit(req, { route: 'architecture', limit: 10, windowMs: 60_000 });
        if (limited) return limited;

        const parsed = await readJsonBody<{ slug?: string; mode?: string }>(req, 'architecture');
        if (!parsed.ok) return parsed.response;

        const slug = requireString(parsed.data.slug);
        if (!slug) {
            return NextResponse.json({ error: 'Project slug is required.' }, { status: 400 });
        }

        const project = findProject(slug);
        if (!project) {
            return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
        }

        const mode = toMode(requireString(parsed.data.mode) ?? 'overview');
        const diagram = ARCHITECTURE_DIAGRAMS[project.id];
        const client = getGroqClient();

        // If there is no Groq key or diagram, fall back to a simple conceptual explanation as a single chunk.
        if (!client || !diagram) {
            const fallback = await generateArchitectureExplanation(project, mode).catch(() =>
                buildConceptualArchitectureExplanation(project),
            );
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(fallback));
                    controller.close();
                },
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    Connection: 'keep-alive',
                },
            });
        }

        const prompt = generateArchitecturePrompt(project, diagram, mode);

        const completion = await client.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            temperature: 0.4,
            max_tokens: 600,
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are a senior software architect. Respond ONLY with bullet points formatted as "- Box X: description". Each bullet must start with "- Box" followed by the number. No paragraphs, no introductions, no conclusions, no markdown headers. Maximum 8 bullets.',
                },
                { role: 'user', content: prompt },
            ],
        });

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of completion) {
                        if (chunk.choices?.[0]?.finish_reason === 'stop') {
                            break;
                        }
                        const content = chunk.choices?.[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch {
                    logAiError('architecture', 'stream_failed');
                    const fallback = buildConceptualArchitectureExplanation(project);
                    controller.enqueue(encoder.encode(fallback));
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        describeRouteError('architecture', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}