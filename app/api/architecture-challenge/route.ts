import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { projectId, attempt }: { projectId?: number; attempt?: string } = await req.json();

        if (!projectId || !attempt?.trim()) {
            return NextResponse.json({ error: 'Project id and attempt description are required.' }, { status: 400 });
        }

        const project = PROJECTS.find((p) => p.id === projectId);
        const diagram = ARCHITECTURE_DIAGRAMS[projectId];

        if (!project || !diagram) {
            return NextResponse.json({ error: 'Project or diagram not found.' }, { status: 404 });
        }

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                {
                    feedback:
                        'Challenge mode is offline. Compare your attempt against the ASCII Boxes 1→6 and check whether your components and arrows line up with the documented flow.',
                },
                { status: 200 },
            );
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
        console.error('architecture-challenge error', error);
        return NextResponse.json({ error: 'Failed to review challenge attempt.' }, { status: 500 });
    }
}


