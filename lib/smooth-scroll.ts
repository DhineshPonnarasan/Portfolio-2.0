'use client';

import Lenis from 'lenis';

/**
 * Lazy singleton Lenis instance. Importing this module does NOT start
 * animation — call `getLenis()` to obtain a shared instance and then
 * `instance.start()` if you need a non-React-aware smooth scroll.
 *
 * For navbar links and footer CTAs, prefer `scrollToAnchor` which computes
 * an offset so the heading isn't clipped by the sticky navbar.
 */

let instance: Lenis | null = null;

export function getLenis(): Lenis | null {
    if (typeof window === 'undefined') return null;
    if (instance) return instance;

    // Respect reduced motion — return null so callers fall through to native.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return null;
    }

    instance = new Lenis({
        lerp: 0.1,
        duration: 1.4,
        // Anchor links should respect the navbar offset.
        anchors: { offset: -80 },
    });
    return instance;
}

/**
 * Programmatically scroll to an in-page anchor (`#section-id`). Falls back to
 * `element.scrollIntoView` when Lenis isn't available or reduced motion is set.
 *
 * `extraOffset` is added on top of the default navbar offset (80px) for
 * sections that need a bit more breathing room.
 */
export function scrollToAnchor(hash: string, extraOffset = 0): void {
    if (typeof window === 'undefined') return;
    const id = hash.startsWith('#') ? hash.slice(1) : hash;
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = getLenis();
    if (lenis) {
        lenis.scrollTo(el, { offset: -80 - extraOffset });
        return;
    }

    const top = el.getBoundingClientRect().top + window.scrollY - 80 - extraOffset;
    window.scrollTo({ top, behavior: 'smooth' });
}
