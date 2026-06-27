'use client';

import { useEffect, useState } from 'react';
import { MY_CONTRIBUTIONS } from '@/lib/data';
import { Github, Star, GitFork, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsResponse {
    repos: Record<string, { stars: number; forks: number; pushedAt: string | null } | null>;
}

interface Props {
    reducedMotion: boolean;
    shimmer: boolean;
}

const repos = MY_CONTRIBUTIONS.map((c) => c.repo).filter(
    (r): r is string => typeof r === 'string' && r.length > 0,
);

const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
};

const GitHubStats = ({ reducedMotion: _reducedMotion, shimmer }: Props) => {
    const [data, setData] = useState<StatsResponse['repos'] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (repos.length === 0) {
            setError(true);
            return;
        }
        const ctrl = new AbortController();
        (async () => {
            try {
                const res = await fetch(`/api/github-stats?repos=${repos.join(',')}`, {
                    signal: ctrl.signal,
                });
                if (!res.ok) {
                    setError(true);
                    return;
                }
                const json = (await res.json()) as StatsResponse;
                setData(json.repos);
            } catch {
                setError(true);
            }
        })();
        return () => ctrl.abort();
    }, []);

    const totalStars = data
        ? Object.values(data).reduce<number>((sum, r) => sum + (r?.stars ?? 0), 0)
        : 0;
    const totalForks = data
        ? Object.values(data).reduce<number>((sum, r) => sum + (r?.forks ?? 0), 0)
        : 0;

    return (
        <article
            className={cn(
                'rounded-2xl border border-white/10 bg-white/[0.03] p-6',
                shimmer && !data && !error && 'animate-pulse',
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-white/60">
                    Open Source Impact
                </h3>
                <Github size={18} className="text-white/40" aria-hidden="true" />
            </div>
            {error || (!data && !shimmer) ? (
                <p className="mt-4 text-sm text-white/60">
                    Live stats unavailable right now. Repos linked below.
                </p>
            ) : !data ? (
                <div className="mt-4 space-y-2">
                    <div className="h-7 w-32 rounded bg-white/5" />
                    <div className="h-4 w-48 rounded bg-white/5" />
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="flex items-center gap-2 text-white/50">
                            <Star size={14} className="text-primary" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">
                                Stars
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-anton">{formatNumber(totalStars)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="flex items-center gap-2 text-white/50">
                            <GitFork size={14} className="text-secondary" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">
                                Forks
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-anton">{formatNumber(totalForks)}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-[11px] text-white/50">
                        <Activity size={12} aria-hidden="true" />
                        <span>Across {repos.length} repositories — live via ungh.cc</span>
                    </div>
                </div>
            )}
        </article>
    );
};

export default GitHubStats;
