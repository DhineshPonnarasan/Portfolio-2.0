import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { getGroqClient } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { buildConceptualArchitectureExplanation } from '@/lib/architecture';
import { readJsonBody, requirePositiveInt, describeRouteError } from '@/lib/api-helpers';

const SYSTEM_PROMPT = `You are a senior systems architect who explains designs in one confident voice.
- Describe the flow strictly from Box 1 → Box 6.
- Explain why each step exists and how the arrows move work between boxes.
- Use concise paragraphs (no bullet spam) and reference Box numbers explicitly.
- Keep it under 180 words.
- Never redraw, edit, or contradict the ASCII diagram.`;

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, { route: 'architecture-explain', limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const parsed = await readJsonBody<{ projectId?: number }>(req, 'architecture-explain');
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

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json(
        { explanation: buildConceptualArchitectureExplanation(project) },
        { status: 200 },
      );
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
    describeRouteError('architecture-explain', error);
    return NextResponse.json({ error: 'Failed to explain architecture.' }, { status: 500 });
  }
}