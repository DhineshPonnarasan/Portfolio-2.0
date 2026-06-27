import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { getGroqClient } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { readJsonBody, requirePositiveInt, requireString, describeRouteError } from '@/lib/api-helpers';

const OFFLINE_FALLBACK =
    'Challenge mode is offline. Compare your attempt against the ASCII Boxes 1→6 and check whether your components and arrows line up with the documented flow.';

export async function POST(req: NextRequest) {
    try {
        const limited = applyRateLimit(req, { route: 'architecture-challenge', limit: 10, windowMs: 60_000 });
        if (limited) return limited;

        const parsed = await readJsonBody<{ projectId?: number; attempt?: string }>(
            req,
            'architecture-challenge',
        );
        if (!parsed.ok) return parsed.response;

        const projectId = requirePositiveInt(parsed.data.projectId);
        const attempt = requireString(parsed.data.attempt);
        if (!projectId || !attempt) {
            return NextResponse.json({ error: 'Project id and attempt description are required.' }, { status: 400 });
        }

        const project = PROJECTS.find((p) => p.id === projectId);
        const diagram = ARCHITECTURE_DIAGRAMS[projectId];

        if (!project || !diagram) {
            return NextResponse.json({ error: 'Project or diagram not found.' }, { status: 404 });
        }

        const groq = getGroqClient();
        if (!groq) {
            return NextResponse.json({ feedback: OFFLINE_FALLBACK }, { status: 200 });
        }

        const prompt = `You are reviewing a candidate's attempt at reconstructing the architecture for "${project.title}".

Canonical ASCII diagram (immutable reference):
${diagram}

Candidate attempt (user-selected components and links):
${attempt}

Give precise feedback:
- Where their flow matches Boxes 1→6.
- Where they diverge or miss important steps.
- One short suggestion for how they could tighten the design.
Keep it under 220 words, use Markdown paragraphs, and reference Box numbers explicitly.`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            temperature: 0.45,
            max_tokens: 600,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a calm architecture reviewer. You only critique relative to the canonical ASCII Boxes 1→6 and do not redraw the system.',
                },
                { role: 'user', content: prompt },
            ],
        });

        const feedback = completion.choices?.[0]?.message?.content?.trim();

        if (!feedback) {
            return NextResponse.json({ error: 'No feedback generated.' }, { status: 502 });
        }

        return NextResponse.json({ feedback });
    } catch (error) {
        describeRouteError('architecture-challenge', error);
        return NextResponse.json({ error: 'Failed to review challenge attempt.' }, { status: 500 });
    }
}