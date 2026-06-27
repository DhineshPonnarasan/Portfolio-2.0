'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    label: string;
    /** Optional inline icon (e.g. lucide-react component). */
    icon?: ReactNode;
    className?: string;
    /** Click handler — when provided the pill behaves as a filter chip. */
    onClick?: () => void;
    /** Whether this pill is currently selected/active. */
    active?: boolean;
}

/**
 * Tech pill that pairs a label with an optional inline glyph. Falls back to
 * a flat text pill when no icon is supplied, so callers can opt-in to the
 * richer variant incrementally.
 */
const TechPill = ({ label, icon, className, onClick, active }: Props) => {
    const Tag: 'button' | 'span' = onClick ? 'button' : 'span';
    const Comp = Tag as 'button';
    return (
        <Comp
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            aria-pressed={onClick ? Boolean(active) : undefined}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-[0.15em] transition-colors',
                active
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-primary/40 hover:text-primary',
                className,
            )}
        >
            {icon ? <span className="text-current">{icon}</span> : null}
            <span>{label}</span>
        </Comp>
    );
};

export default TechPill;
