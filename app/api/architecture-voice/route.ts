import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior systems architect explaining designs in a clear, concise voice.
- Describe the flow strictly from Box 1 → Box 6.
- Be SHORT and PRECISE - maximum 100 words.
- Use natural, spoken language (as if explaining to a colleague).
- Reference Box numbers explicitly (Box 1, Box 2, etc.).
- Focus on the key flow and purpose of each step.
- Never redraw, edit, or contradict the ASCII diagram.
- Use short sentences and avoid complex jargon.
- Get straight to the point - no fluff or filler.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key missing' }, { status: 500 });
    }

    const { projectId, question }: { projectId?: number; question?: string } = await req.json();

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

    // If question is provided, answer it. Otherwise, provide general explanation
    const userPrompt = question
      ? `Project: ${project.title}
Description: ${description}
ASCII architecture (immutable):
${diagram}

Question: ${question}

Provide a clear, spoken-style answer that references Box numbers.`
      : `Project: ${project.title}
Description: ${description}
ASCII architecture (immutable):
${diagram}

Generate a natural, conversational explanation that narrates how work moves from Box 1 to Box 6, as if you're explaining it verbally to someone.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4, // Lower for more precise, concise responses
      max_tokens: 250, // Reduced for shorter responses
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    });

    const explanation = completion.choices?.[0]?.message?.content?.trim();

    if (!explanation) {
      return NextResponse.json({ error: 'No explanation generated.' }, { status: 502 });
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('architecture-voice error', error);
    return NextResponse.json({ error: 'Failed to explain architecture.' }, { status: 500 });
  }
}

