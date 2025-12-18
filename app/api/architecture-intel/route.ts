import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an elite staff-level systems architect who explains complex ML, data, and cloud systems with clarity.
- Keep answers under 220 words.
- Reference the ASCII diagram strictly by Box numbers (1 through 6) and arrows between them.
- Never rewrite, redraw, or contradict the ASCII diagram.
- Explain what's happening and why, in a single confident engineering voice.
- If unsure, say you do not have that detail.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key missing' }, { status: 500 });
    }

    const { projectId, question }: {
      projectId?: number;
      question?: string;
    } = await req.json();

    if (!projectId || !question?.trim()) {
      return NextResponse.json({ error: 'Project id and question are required.' }, { status: 400 });
    }

    const project = PROJECTS.find((p) => p.id === projectId);
    const diagram = ARCHITECTURE_DIAGRAMS[projectId];

    if (!project || !diagram) {
      return NextResponse.json({ error: 'Project or diagram not found.' }, { status: 404 });
    }

    const description = Array.isArray(project.description)
      ? project.description.join(' ')
      : project.description;

    const techSummary = project.techStack?.join(', ') || project.techAndTechniques?.join(', ') || 'Not specified';

    const userPrompt = `Project: ${project.title}
Project description:
${description}

Tech highlights: ${techSummary}

ASCII architecture (immutable reference):
${diagram}

User question:
${question}

Instructions:
- Mention the exact Box numbers you rely on.
- Walk through the relevant flow from Box 1 → Box 6 as needed.
- Explain why each referenced step matters for the user question.
- Stay within 220 words.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.35,
      max_tokens: 600,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('architecture-intel error', error);
    return NextResponse.json({ error: 'Failed to reach Groq.' }, { status: 500 });
  }
}
