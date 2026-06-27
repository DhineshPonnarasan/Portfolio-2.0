'use client';

import { Trophy, ExternalLink, Lock } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/data';

interface Props {
    reducedMotion: boolean;
}

const lcLink = SOCIAL_LINKS.find((l) => l.name.toLowerCase() === 'leetcode');

/**
 * LeetCode rating card. Gated on `NEXT_PUBLIC_LEETCODE_USERNAME` — when the
 * env var is set we render an active link to the user's profile; otherwise
 * we fall back to a privacy-friendly placeholder so the site never makes a
 * network call to LeetCode without an explicit opt-in.
 */
const LeetCodeCard = (_: Props) => {
    const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;
    const href = lcLink?.url;

    return (
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-white/60">
                    LeetCode
                </h3>
                <Trophy size={18} className="text-primary" aria-hidden="true" />
            </div>

            {username && href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-white/85 hover:text-primary transition-colors"
                >
                    @{username}
                    <ExternalLink size={12} aria-hidden="true" />
                </a>
            ) : (
                <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                    <Lock size={12} aria-hidden="true" />
                    <span>Rating card available once verified.</span>
                </div>
            )}
            <p className="mt-3 text-xs text-white/40">
                Algorithmic problem solving across arrays, trees, DP, graphs, and
                systems-level interview prep.
            </p>
        </article>
    );
};

export default LeetCodeCard;
