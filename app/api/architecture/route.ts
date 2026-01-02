import { NextRequest } from 'next/server';
import { Groq } from 'groq-sdk';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import {
    ArchitectureMode,
    buildConceptualArchitectureExplanation,
    findProject,
    generateArchitecturePrompt,
    generateArchitectureExplanation,
} from '@/lib/architecture';

let groqClient: Groq | null = null;

const getGroqClient = () => {
    if (groqClient) return groqClient;
    if (!process.env.GROQ_API_KEY) {
        return null;
    }
    groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    return groqClient;
};

function toMode(value: string | undefined): ArchitectureMode {
    if (value === 'data' || value === 'deployment') return value;
    return 'overview';
}

export async function POST(req: NextRequest) {
    try {
        const { slug, mode: rawMode }: { slug?: string; mode?: ArchitectureMode | string } = await req.json();

        if (!slug) {
            return new Response(JSON.stringify({ error: 'Project slug is required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const project = findProject(slug);

        if (!project) {
            return new Response(JSON.stringify({ error: 'Project not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const mode = toMode(typeof rawMode === 'string' ? rawMode : 'overview');
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
                    for await (const chunk of completion as any) {
                        if (chunk.choices?.[0]?.finish_reason === 'stop') {
                            break;
                        }
                        const content = chunk.choices?.[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (error) {
                    console.error('architecture stream error', error);
                    // Send fallback explanation instead of error
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
        console.error('architecture route error', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


