import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { getGroqClient } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { buildConceptualArchitectureExplanation } from '@/lib/architecture';
import { readJsonBody, requirePositiveInt, requireString, describeRouteError } from '@/lib/api-helpers';

const SYSTEM_PROMPT = `You are a calm, precise staff engineer who narrates how an architecture behaves under stress.
- Reference Box numbers (1→6) and arrows connecting them.
- Describe the sequence of events, impacts, and mitigation levers.
- Keep responses under 220 words and use Markdown subheadings for "What happens" and "Stabilizing moves".
- Never change or redraw the ASCII diagram.`;

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, { route: 'architecture-simulate', limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const parsed = await readJsonBody<{ projectId?: number; scenario?: string }>(
      req,
      'architecture-simulate',
    );
    if (!parsed.ok) return parsed.response;

    const projectId = requirePositiveInt(parsed.data.projectId);
    const scenario = requireString(parsed.data.scenario);
    if (!projectId || !scenario) {
      return NextResponse.json({ error: 'Project id and scenario are required.' }, { status: 400 });
    }

    const project = PROJECTS.find((p) => p.id === projectId);
    const diagram = ARCHITECTURE_DIAGRAMS[projectId];

    if (!project || !diagram) {
      return NextResponse.json({ error: 'Project or ASCII diagram not found.' }, { status: 404 });
    }

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json(
        { simulation: buildConceptualArchitectureExplanation(project) },
        { status: 200 },
      );
    }

    const description = Array.isArray(project.description)
      ? project.description.join(' ')
      : project.description || '';

    const prompt = `Project: ${project.title}
Description: ${description}
Scenario: ${scenario}
ASCII architecture (immutable reference):
${diagram}

Narrate, using Box numbers, how this scenario plays out and how engineers stabilize it.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.35,
      max_tokens: 600,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });

    const simulation = completion.choices?.[0]?.message?.content?.trim();

    if (!simulation) {
      return NextResponse.json({ error: 'No simulation generated.' }, { status: 502 });
    }

    return NextResponse.json({ simulation });
  } catch (error) {
    describeRouteError('architecture-simulate', error);
    return NextResponse.json({ error: 'Failed to simulate architecture.' }, { status: 500 });
  }
}