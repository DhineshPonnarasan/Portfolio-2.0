import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { getGroqClient } from '@/lib/groq';
import { applyRateLimit } from '@/lib/rateLimit';
import { buildConceptualArchitectureExplanation } from '@/lib/architecture';
import { readJsonBody, requirePositiveInt, requireString, describeRouteError } from '@/lib/api-helpers';

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
    const limited = applyRateLimit(req, { route: 'architecture-intel', limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const parsed = await readJsonBody<{ projectId?: number; question?: string }>(
      req,
      'architecture-intel',
    );
    if (!parsed.ok) return parsed.response;

    const projectId = requirePositiveInt(parsed.data.projectId);
    const question = requireString(parsed.data.question);
    if (!projectId || !question) {
      return NextResponse.json({ error: 'Project id and question are required.' }, { status: 400 });
    }

    const project = PROJECTS.find((p) => p.id === projectId);
    const diagram = ARCHITECTURE_DIAGRAMS[projectId];

    if (!project || !diagram) {
      return NextResponse.json({ error: 'Project or diagram not found.' }, { status: 404 });
    }

    const techSummary = project.techStack?.join(', ') || project.techAndTechniques?.join(', ') || 'Not specified';

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json(
        { answer: buildConceptualArchitectureExplanation(project) },
        { status: 200 },
      );
    }

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
    describeRouteError('architecture-intel', error);
    return NextResponse.json({ error: 'Unable to process request. Please try again.' }, { status: 500 });
  }
}