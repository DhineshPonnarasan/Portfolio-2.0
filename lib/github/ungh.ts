/**
 * Tiny wrapper around ungh.cc (https://ungh.cc) — no auth required.
 *
 * Used by:
 *   - app/api/github-stats/route.ts to proxy + cache repo stats
 *   - any client component that wants live stars/forks data without leaking
 *     a GitHub token to the browser.
 */

const UNGH_BASE = 'https://ungh.cc';

export interface UnghRepoStats {
    stars: number;
    forks: number;
    pushedAt: string | null;
    name: string;
    owner: string;
}

export interface UnghRepoResponse {
    repo?: {
        id?: number;
        name?: string;
        repo?: string;
        owner?: string;
        description?: string;
        stars?: number;
        forks?: number;
        defaultBranch?: string;
        createdAt?: string;
        pushedAt?: string;
    };
}

export function parseOwnerRepo(ownerName: string): { owner: string; repo: string } | null {
    if (!ownerName) return null;
    const [owner, repo] = ownerName.split('/');
    if (!owner || !repo) return null;
    return { owner, repo };
}

export async function fetchUnghRepo(ownerName: string, signal?: AbortSignal): Promise<UnghRepoStats | null> {
    const parsed = parseOwnerRepo(ownerName);
    if (!parsed) return null;

    try {
        const url = `${UNGH_BASE}/repos/${parsed.owner}/${parsed.repo}`;
        const res = await fetch(url, {
            // ungh.cc doesn't need auth and returns JSON
            headers: { Accept: 'application/json' },
            signal,
            next: { revalidate: 3600, tags: ['gh-stats'] },
        });
        if (!res.ok) return null;
        const data = (await res.json()) as UnghRepoResponse;
        const r = data?.repo;
        if (!r) return null;
        return {
            stars: r.stars ?? 0,
            forks: r.forks ?? 0,
            pushedAt: r.pushedAt ?? null,
            name: r.name ?? parsed.repo,
            owner: r.owner ?? parsed.owner,
        };
    } catch {
        // Network / parse failure — return null so callers can show a graceful skeleton.
        return null;
    }
}

/**
 * Fan-out helper for multiple repos in parallel. Always resolves; failed
 * lookups come back as `null` so the UI can degrade gracefully.
 */
export async function fetchUnghRepos(
    ownerNames: string[],
    signal?: AbortSignal,
): Promise<Record<string, UnghRepoStats | null>> {
    const entries = await Promise.all(
        ownerNames.map(async (name) => [name, await fetchUnghRepo(name, signal)] as const),
    );
    return Object.fromEntries(entries);
}

/**
 * Fetch closed PR count for a repo via ungh.cc. Best-effort: ungh.cc does
 * not currently expose a /pulls endpoint, so this falls back to 0 when
 * the upstream doesn't respond. We keep the helper so the rest of the code
 * doesn't care whether the upstream exposes it.
 */
export async function fetchClosedPullRequestCount(ownerName: string): Promise<number> {
    const parsed = parseOwnerRepo(ownerName);
    if (!parsed) return 0;
    try {
        const res = await fetch(`${UNGH_BASE}/repos/${parsed.owner}/${parsed.repo}/pulls?state=closed`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 21600 },
        });
        if (!res.ok) return 0;
        const data = (await res.json()) as { pulls?: unknown[] } | unknown[];
        if (Array.isArray(data)) return data.length;
        if (data && typeof data === 'object' && Array.isArray((data as { pulls?: unknown[] }).pulls)) {
            return (data as { pulls: unknown[] }).pulls.length;
        }
        return 0;
    } catch {
        return 0;
    }
}
