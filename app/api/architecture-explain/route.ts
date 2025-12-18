import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior systems architect who explains designs in one confident voice.
- Describe the flow strictly from Box 1 → Box 6.
- Explain why each step exists and how the arrows move work between boxes.
- Use concise paragraphs (no bullet spam) and reference Box numbers explicitly.
- Keep it under 180 words.
- Never redraw, edit, or contradict the ASCII diagram.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key missing' }, { status: 500 });
    }

    const { projectId }: { projectId?: number } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project id is required.' }, { status: 400 });
    }

    const project = PROJECTS.find((p) => p.id === projectId);
    const diagram = ARCHITECTURE_DIAGRAMS[projectId];

    if (!project || !diagram) {
      return NextResponse.json({ error: 'Project or ASCII diagram not found.' }, { status: 404 });
    }

    const description = Array.isArray(project.description)
      ? project.description.join(' ')
      : project.description || '';

    const prompt = `Project: ${project.title}
Description: ${description}
ASCII architecture (immutable):
${diagram}

Generate a single explanation that narrates how work moves from Box 1 to Box 6, clarifying the purpose of each step.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });

    const explanation = completion.choices?.[0]?.message?.content?.trim();

    if (!explanation) {
      return NextResponse.json({ error: 'No explanation generated.' }, { status: 502 });
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('architecture-explain error', error);
    return NextResponse.json({ error: 'Failed to explain architecture.' }, { status: 500 });
  }
}
