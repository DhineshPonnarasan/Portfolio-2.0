import { NextResponse } from 'next/server';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { applyRateLimit } from '@/lib/rateLimit';
import { describeRouteError } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT = { route: 'resume-download', limit: 10, windowMs: 60_000 };

/**
 * GET /api/resume-download
 *
 * Streams the resume PDF. The local counter is privacy-respecting: only a
 * server-side in-process tally (best-effort, single instance) is kept — no
 * third-party analytics are called.
 */
export async function GET(req: Request) {
    const limited = applyRateLimit(req, RATE_LIMIT);
    if (limited) return limited;

    try {
        const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
        const [data, info] = await Promise.all([
            readFile(filePath),
            stat(filePath).catch(() => null),
        ]);
        return new Response(new Uint8Array(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Dhinesh-Ponnarasan-Resume.pdf"',
                'Cache-Control': 'public, max-age=3600',
                'Content-Length': String(info?.size ?? data.byteLength),
            },
        });
    } catch (error) {
        const { code, status } = describeRouteError('resume-download', error);
        return NextResponse.json(
            {
                error: 'Resume not available right now. Please contact via email.',
                code,
            },
            { status: status ?? 404 },
        );
    }
}
