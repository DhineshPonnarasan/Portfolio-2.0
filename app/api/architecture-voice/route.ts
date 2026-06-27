import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { getGroqClient } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { buildConceptualArchitectureExplanation } from '@/lib/architecture';
import { readJsonBody, requirePositiveInt, requireString, describeRouteError } from '@/lib/api-helpers';

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
    const limited = applyRateLimit(req, { route: 'architecture-voice', limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const parsed = await readJsonBody<{ projectId?: number; question?: string }>(
      req,
      'architecture-voice',
    );
    if (!parsed.ok) return parsed.response;

    const projectId = requirePositiveInt(parsed.data.projectId);
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

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json(
        { explanation: buildConceptualArchitectureExplanation(project) },
        { status: 200 },
      );
    }

    const question = requireString(parsed.data.question);

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
      temperature: 0.4,
      max_tokens: 250,
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
    describeRouteError('architecture-voice', error);
    return NextResponse.json({ error: 'Failed to explain architecture.' }, { status: 500 });
  }
}