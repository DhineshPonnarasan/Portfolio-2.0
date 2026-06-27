'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Activity, Loader2 } from 'lucide-react';

interface HeatmapResponse {
    contributions?: Array<{ date: string; count: number; level: number }>;
    total?: number;
    error?: string;
}

interface Props {
    /** GitHub username for the proxy lookup. */
    username?: string;
    /** Optional: precomputed contributions to render synchronously. */
    initial?: HeatmapResponse;
}

const DAYS = 91; // ~13 weeks

const buildEmptyCells = () =>
    Array.from({ length: DAYS }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (DAYS - 1 - i));
        return { date: d.toISOString().slice(0, 10), count: 0, level: 0 };
    });

const levelClasses = [
    'bg-white/[0.04]',
    'bg-primary/20',
    'bg-primary/40',
    'bg-primary/70',
    'bg-primary',
];

/**
 * Build-from-scratch contribution heatmap. Renders 13 weeks of activity
 * (91 days) as a CSS grid. Levels map to five opacity tiers so the user
 * gets a glanceable "intensity" feel without bringing in a charting library.
 *
 * Fetches `/api/contrib-graph` which proxies
 * `github-contributions.vercel.app` (no auth) and caches for 12 hours.
 */
const ContributionHeatmap = ({ username, initial }: Props) => {
    const [data, setData] = useState<HeatmapResponse | null>(initial ?? null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (initial) return;
        const ctrl = new AbortController();
        const qs = username ? `?user=${encodeURIComponent(username)}` : '';
        (async () => {
            try {
                const res = await fetch(`/api/contrib-graph${qs}`, { signal: ctrl.signal });
                if (!res.ok) {
                    setError(true);
                    return;
                }
                const json = (await res.json()) as HeatmapResponse;
                setData(json);
            } catch {
                setError(true);
            }
        })();
        return () => ctrl.abort();
    }, [username, initial]);

    const cells = data?.contributions ?? buildEmptyCells();
    const total = data?.total ?? cells.reduce((sum, c) => sum + c.count, 0);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary" aria-hidden="true" />
                    <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-white/60">
                        Contribution Heatmap
                    </h3>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                    {total} contributions · last {DAYS} days
                </span>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-white/50">
                    <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                    Live heatmap unavailable. Showing recent skeleton.
                </div>
            )}

            <div
                className="grid grid-flow-col grid-rows-7 gap-1"
                style={{ gridTemplateColumns: `repeat(${Math.ceil(cells.length / 7)}, minmax(0, 1fr))` }}
                aria-label={`${total} contributions in the last ${DAYS} days`}
                role="img"
            >
                {cells.map((cell) => (
                    <span
                        key={cell.date}
                        title={`${cell.date}: ${cell.count} contribution${cell.count === 1 ? '' : 's'}`}
                        className={cn(
                            'h-3 w-3 rounded-sm transition-transform hover:scale-125',
                            levelClasses[Math.max(0, Math.min(4, cell.level))] ?? levelClasses[0],
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContributionHeatmap;
