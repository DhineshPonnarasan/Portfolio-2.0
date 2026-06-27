import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTREAM = 'https://github-contributions.vercel.app/api/v1';
const RATE_LIMIT = { route: 'contrib-graph', limit: 60, windowMs: 60_000 };
const MAX_DAYS = 370;

/**
 * GET /api/contrib-graph?user=<username>
 *
 * Proxies github-contributions.vercel.app with `revalidate: 43200` (12h).
 * Caches by username tag. On upstream failure we return a 200 with an
 * empty payload + an `error` flag so the client can render a graceful
 * skeleton instead of an error toast.
 */
export async function GET(req: Request) {
    const limited = applyRateLimit(req, RATE_LIMIT);
    if (limited) return limited;

    const { searchParams } = new URL(req.url);
    const user = (searchParams.get('user') ?? '').trim();
    if (!user) {
        return NextResponse.json(
            { error: 'Provide ?user=<github-username>' },
            { status: 400 },
        );
    }

    const url = `${UPSTREAM}/${encodeURIComponent(user)}`;
    try {
        const upstream = await fetch(url, {
            next: { revalidate: 43200, tags: [`gh-contrib:${user}`] },
            headers: { Accept: 'application/json' },
        });
        if (!upstream.ok) {
            return NextResponse.json(
                { error: `upstream ${upstream.status}`, contributions: [], total: 0 },
                {
                    status: 200,
                    headers: { 'Cache-Control': 'public, max-age=600' },
                },
            );
        }
        const raw = (await upstream.json()) as unknown;
        const contributions = normalise(raw);
        const total = contributions.reduce((sum, c) => sum + c.count, 0);
        return NextResponse.json(
            { contributions, total },
            {
                headers: { 'Cache-Control': 'public, max-age=43200, s-maxage=43200' },
            },
        );
    } catch {
        return NextResponse.json(
            { error: 'upstream_unreachable', contributions: [], total: 0 },
            { status: 200, headers: { 'Cache-Control': 'public, max-age=600' } },
        );
    }
}

function normalise(raw: unknown): Array<{ date: string; count: number; level: number }> {
    if (!Array.isArray(raw)) return [];
    return raw
        .slice(-MAX_DAYS)
        .map((entry) => {
            if (!entry || typeof entry !== 'object') return null;
            const e = entry as Record<string, unknown>;
            const date = typeof e.date === 'string' ? e.date : null;
            const count = typeof e.count === 'number' ? e.count : Number(e.count ?? 0);
            const level = typeof e.level === 'number' ? e.level : Math.min(4, Math.floor((count || 0) / 3));
            if (!date) return null;
            return { date, count: Number.isFinite(count) ? count : 0, level };
        })
        .filter((c): c is { date: string; count: number; level: number } => c !== null);
}
