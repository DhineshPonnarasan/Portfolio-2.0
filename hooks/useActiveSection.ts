'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which section element is currently in the viewport.
 *
 * Uses `IntersectionObserver` with a vertical `rootMargin` that targets the
 * middle of the viewport (`-40% 0px -55% 0px`) so a section becomes "active"
 * roughly when its heading crosses the upper third of the screen.
 *
 * Returns the `id` of the section currently considered active, or `null`
 * when nothing matches (e.g. above-the-fold before any section is reached).
 */
export function useActiveSection(
    ids: readonly string[],
    options: { rootMargin?: string } = {},
): string | null {
    const { rootMargin = '-40% 0px -55% 0px' } = options;
    const [active, setActive] = useState<string | null>(ids[0] ?? null);

    useEffect(() => {
        if (typeof window === 'undefined' || ids.length === 0) return;

        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const visible = new Map<string, number>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        visible.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visible.delete(entry.target.id);
                    }
                }

                if (visible.size === 0) return;

                let bestId: string | null = null;
                let bestRatio = -1;
                for (const [id, ratio] of visible) {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = id;
                    }
                }

                if (bestId) setActive(bestId);
            },
            {
                rootMargin,
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ids, rootMargin]);

    return active;
}
