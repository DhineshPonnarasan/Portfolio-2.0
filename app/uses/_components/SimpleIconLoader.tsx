'use client';

import { useMemo } from 'react';
import {
    Terminal,
    Box,
    Layers,
    Pencil,
    Image as ImageIcon,
    Cloud,
    Github,
    Workflow,
    ListChecks,
    Headphones,
    Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    slug: string;
    name: string;
}

const SLUG_TO_LUCIDE: Record<string, React.ComponentType<{ className?: string; 'aria-label'?: string }>> = {
    vscode: Terminal,
    warp: Box,
    tmux: Terminal,
    notion: Layers,
    arcbrowser: Workflow,
    raycast: ListChecks,
    figma: Pencil,
    excalidraw: Pencil,
    vercel: Cloud,
    render: Cloud,
    githubactions: Github,
    linear: ListChecks,
    n8n: Workflow,
    sony: Headphones,
    keychron: Keyboard,
};

/**
 * Lightweight icon resolver for /uses. We avoid pulling in `simple-icons`
 * (a multi-MB dependency for ~15 icons) by mapping each slug to a
 * `lucide-react` icon where possible. Anything we don't have a mapping for
 * falls back to a 2-letter monogram. The result still feels icon-led
 * without growing the bundle.
 */
export function SimpleIconLoader({ slug, name }: Props) {
    const Icon = useMemo(() => SLUG_TO_LUCIDE[slug], [slug]);

    if (Icon) {
        return (
            <Icon
                className={cn('size-5 text-primary')}
                aria-label={`${name} icon`}
            />
        );
    }

    const initials = name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <span
            className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-primary"
            aria-hidden="true"
        >
            {initials}
        </span>
    );
}
