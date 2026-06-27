import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { getGroqClient } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { readJsonBody, requirePositiveInt, describeRouteError } from '@/lib/api-helpers';

const SYSTEM_PROMPT = `You are a battle-tested principal engineer. When comparing systems, you speak in crisp engineering language with zero fluff.`;

const OFFLINE_FALLBACK =
    'Live architecture comparison is offline. Open the dedicated comparison panel from any project page to view side-by-side flows.';

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, { route: 'architecture-compare', limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const parsed = await readJsonBody<{ firstProjectId?: number; secondProjectId?: number }>(
      req,
      'architecture-compare',
    );
    if (!parsed.ok) return parsed.response;

    const firstProjectId = requirePositiveInt(parsed.data.firstProjectId);
    const secondProjectId = requirePositiveInt(parsed.data.secondProjectId);

    if (!firstProjectId || !secondProjectId || firstProjectId === secondProjectId) {
      return NextResponse.json({ error: 'Select two different projects.' }, { status: 400 });
    }

    const firstProject = PROJECTS.find((p) => p.id === firstProjectId);
    const secondProject = PROJECTS.find((p) => p.id === secondProjectId);

    const firstDiagram = ARCHITECTURE_DIAGRAMS[firstProjectId];
    const secondDiagram = ARCHITECTURE_DIAGRAMS[secondProjectId];

    if (!firstProject || !secondProject || !firstDiagram || !secondDiagram) {
      return NextResponse.json({ error: 'Unable to locate diagrams for one of the projects.' }, { status: 404 });
    }

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json({ comparison: OFFLINE_FALLBACK }, { status: 200 });
    }

    const firstSummary = Array.isArray(firstProject.description)
      ? firstProject.description.join(' ')
      : firstProject.description;
    const secondSummary = Array.isArray(secondProject.description)
      ? secondProject.description.join(' ')
      : secondProject.description;

    const prompt = `Compare these architectures along:
  1. Data flow differences
  2. Model choice & intelligence stack
  3. Scalability posture
  4. Latency characteristics
  5. Engineering trade-offs (operations, risk, maintenance)

  Return Markdown with H3 headings for each axis. Beneath every heading, add bullet points for "${firstProject.title}" and "${secondProject.title}". Emphasize contrasts and avoid fabricating metrics.

---
${firstProject.title}:
|Description: ${firstSummary}
|Tech: ${firstProject.techStack?.join(', ') || firstProject.techAndTechniques?.join(', ') || 'Not specified'}
|ASCII diagram:
${firstDiagram}

---
${secondProject.title}:
|Description: ${secondSummary}
|Tech: ${secondProject.techStack?.join(', ') || secondProject.techAndTechniques?.join(', ') || 'Not specified'}
|ASCII diagram:
${secondDiagram}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });

    const comparison = completion.choices?.[0]?.message?.content?.trim();

    if (!comparison) {
      return NextResponse.json({ error: 'No comparison generated.' }, { status: 502 });
    }

    return NextResponse.json({ comparison });
  } catch (error) {
    describeRouteError('architecture-compare', error);
    return NextResponse.json({ error: 'Failed to compare architectures.' }, { status: 500 });
  }
}