import { NextResponse } from 'next/server';
import { fetchClosedPullRequestCount, parseOwnerRepo } from '@/lib/github/ungh';
import { applyRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT = { route: 'merged-prs', limit: 60, windowMs: 60_000 };
const MAX_REPOS = 25;
const CACHE_TAG_PREFIX = 'gh-prs:';

/**
 * GET /api/merged-prs?repos=owner/name,owner/name
 *
 * Returns `{ counts: { [repo]: number | null } }`. Each count is cached
 * for 6 hours. Upstream failures degrade to `null` so the client can
 * render gracefully.
 */
export async function GET(req: Request) {
    const limited = applyRateLimit(req, RATE_LIMIT);
    if (limited) return limited;

    const { searchParams } = new URL(req.url);
    const repos = (searchParams.get('repos') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_REPOS);

    if (repos.length === 0) {
        return NextResponse.json({ error: 'Provide ?repos=owner/name,owner/name' }, { status: 400 });
    }

    const entries = await Promise.all(
        repos.map(async (repo) => {
            const parsed = parseOwnerRepo(repo);
            if (!parsed) return [repo, null] as const;
            const count = await fetchClosedPullRequestCount(repo);
            return [repo, count] as const;
        }),
    );
    const counts = Object.fromEntries(entries);

    return NextResponse.json(
        { counts },
        {
            headers: {
                'Cache-Control': 'public, max-age=21600, s-maxage=21600',
                'x-cache-tag-prefix': CACHE_TAG_PREFIX,
            },
        },
    );
}
