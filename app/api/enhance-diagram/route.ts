import { PROJECTS } from '@/lib/data';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readJsonBody, requireString, describeRouteError } from '@/lib/api-helpers';
import { applyRateLimit } from '@/lib/rateLimit';
import { NextResponse } from 'next/server';
import { logAiError } from '@/lib/groq';

// Read a pre-rendered `<div class="diagram" id="dX">` block from the static
// diagram bundle. Kept intentionally simple — the file ships with the build
// and is read once per request. Failures are reported as 404 so the client
// falls back gracefully.
function extractDiagramFromHTML(projectSlug: string): string | null {
    try {
        const htmlPath = path.join(process.cwd(), 'public', 'portfolio_arch_diagrams.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        const projectIndex = PROJECTS.findIndex((p) => p.slug === projectSlug);
        if (projectIndex === -1) {
            logAiError('enhance-diagram', 'project_not_found', { slug: projectSlug });
            return null;
        }

        const diagramId = `d${projectIndex + 1}`;
        const diagramRegex = new RegExp(
            `<div class=\\"diagram\\" id=\\"${diagramId}\\">([\\s\\S]*?)<\\/div>`,
            'm',
        );
        const match = htmlContent.match(diagramRegex);
        if (!match) {
            logAiError('enhance-diagram', 'diagram_not_found', { diagramId });
            return null;
        }
        return `<div class="diagram" id="${diagramId}">${match[1]}</div>`;
    } catch {
        logAiError('enhance-diagram', 'read_failed');
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const limited = applyRateLimit(request, {
            route: 'enhance-diagram',
            limit: 10,
            windowMs: 60_000,
        });
        if (limited) return limited;

        const parsed = await readJsonBody<{ projectSlug?: string }>(request, 'enhance-diagram');
        if (!parsed.ok) return parsed.response;

        const projectSlug = requireString(parsed.data.projectSlug);
        if (!projectSlug) {
            return NextResponse.json({ error: 'Project slug is required' }, { status: 400 });
        }

        const project = PROJECTS.find((p) => p.slug === projectSlug);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const diagramHtml = extractDiagramFromHTML(projectSlug);
        if (!diagramHtml) {
            return NextResponse.json({ error: 'Diagram not found' }, { status: 404 });
        }

        return NextResponse.json(
            {
                projectTitle: project.title,
                diagramHtml,
                success: true,
            },
            {
                status: 200,
                headers: {
                    // The diagram file is keyed by slug and changes only when
                    // the project itself is updated, so cache aggressively.
                    'Cache-Control': 'public, max-age=300, s-maxage=3600',
                },
            },
        );
    } catch (error) {
        describeRouteError('enhance-diagram', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
