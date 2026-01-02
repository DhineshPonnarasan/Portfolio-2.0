import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior systems architect explaining ML and data architectures.

STRICT FORMAT:
- Use ONLY bullet points (- or •)
- Reference specific Box numbers (Box 1, Box 2, etc.)
- One clear, actionable sentence per bullet
- Maximum 5-6 bullets per response
- No introductions, conclusions, or filler text
- Be direct and technical

If you don't know something, say "This detail isn't documented in the architecture."`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 500 });
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
Tech: ${techSummary}

Architecture:
${diagram}

Question: ${question}

Respond with bullet points only. Reference Box numbers explicitly.`;

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
    return NextResponse.json({ error: 'Unable to process request. Please try again.' }, { status: 500 });
  }
}
