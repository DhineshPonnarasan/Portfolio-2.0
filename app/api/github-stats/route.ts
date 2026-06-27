import { NextResponse } from 'next/server';
import { fetchUnghRepo } from '@/lib/github/ungh';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REPOS = 25;

/**
 * GET /api/github-stats?repos=owner/name,owner/name
 *
 * Returns a JSON object keyed by `owner/name` → UnghRepoStats | null.
 * Caches upstream responses for 1 hour; tag-based revalidation on
 * `revalidateTag('gh-stats')` is supported from server code.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const reposParam = searchParams.get('repos') ?? '';
    const repos = reposParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_REPOS);

    if (repos.length === 0) {
        return NextResponse.json({ error: 'Provide ?repos=owner/name,owner/name' }, { status: 400 });
    }

    const entries = await Promise.all(
        repos.map(async (name) => [name, await fetchUnghRepo(name)] as const),
    );
    const payload = Object.fromEntries(entries);

    return NextResponse.json(
        { repos: payload },
        {
            headers: {
                // Allow public caching on the edge while still keeping the
                // response relatively fresh.
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        },
    );
}
