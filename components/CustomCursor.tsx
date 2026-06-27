'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion-prefs';

gsap.registerPlugin(useGSAP);

const MOBILE_BREAKPOINT = 768;
const THROTTLE_MS = 16; // ~60fps cap

const CustomCursor = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const lastUpdateRef = useRef(0);
    const pendingFrameRef = useRef<number | null>(null);
    const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const reducedMotion = useReducedMotion();
    const [isCoarse, setIsCoarse] = useState(false);

    // Detect coarse pointers (touch devices) — the custom cursor must never
    // render on touch, because the native pointer is already the primary
    // interaction model there.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(pointer: coarse)');
        setIsCoarse(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    // Throttled mousemove handler — coalesces many events into one frame and
    // honours prefers-reduced-motion by skipping the GSAP smooth-follow entirely.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth < MOBILE_BREAKPOINT) return;
        if (reducedMotion || isCoarse) return;

        const flush = () => {
            pendingFrameRef.current = null;
            lastUpdateRef.current = performance.now();
            const { x, y } = targetRef.current;
            if (svgRef.current) {
                gsap.to(svgRef.current, {
                    x,
                    y,
                    ease: 'power2.out',
                    duration: 0.25,
                    opacity: 1,
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
            const now = performance.now();
            const elapsed = now - lastUpdateRef.current;
            if (elapsed >= THROTTLE_MS && pendingFrameRef.current === null) {
                pendingFrameRef.current = requestAnimationFrame(flush);
            } else if (elapsed < THROTTLE_MS && pendingFrameRef.current === null) {
                pendingFrameRef.current = requestAnimationFrame(flush);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (pendingFrameRef.current !== null) {
                cancelAnimationFrame(pendingFrameRef.current);
                pendingFrameRef.current = null;
            }
        };
    }, [reducedMotion, isCoarse]);

    // Card-CTA snap — when the user hovers an element marked with
    // `data-cursor="cta"`, the cursor briefly snaps to its centre to draw
    // the eye to the call-to-action. Returns to the live pointer on leave.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth < MOBILE_BREAKPOINT) return;
        if (reducedMotion || isCoarse) return;
        if (!svgRef.current) return;

        const snap = (el: Element) => {
            const r = el.getBoundingClientRect();
            if (svgRef.current) {
                gsap.to(svgRef.current, {
                    x: r.left + r.width / 2,
                    y: r.top + r.height / 2,
                    duration: 0.2,
                    ease: 'power3.out',
                    opacity: 1,
                });
            }
        };

        const onEnter = (e: Event) => snap(e.currentTarget as Element);
        const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cursor="cta"]'));
        targets.forEach((t) => t.addEventListener('mouseenter', onEnter));
        return () => {
            targets.forEach((t) => t.removeEventListener('mouseenter', onEnter));
        };
    }, [reducedMotion, isCoarse]);

    // Mobile / reduced-motion / coarse-pointer users never get the custom
    // cursor rendered.
    useGSAP(
        () => {
            // Reserved for future GSAP-driven cursor animations; intentionally
            // left empty now that we use a throttled rAF loop above.
        },
        { scope: svgRef },
    );

    if (reducedMotion || isCoarse) {
        return null;
    }

    return (
        <svg
            width="27"
            height="30"
            viewBox="0 0 27 30"
            className="hidden md:block fixed top-0 left-0 opacity-0 z-[100] pointer-events-none"
            fill="none"
            id="cursor"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            ref={svgRef}
            aria-hidden="true"
        >
            <path
                d="M20.0995 11.0797L3.72518 1.13204C2.28687 0.258253 0.478228 1.44326 0.704999 3.11083L3.28667 22.0953C3.58333 24.2768 7.33319 24.6415 8.3792 22.7043C9.5038 20.6215 10.8639 18.7382 12.43 17.7122C13.996 16.6861 16.2658 16.1911 18.6244 15.9918C20.8181 15.8063 21.9811 12.2227 20.0995 11.0797Z"
                className="fill-foreground stroke-background/50"
            />
        </svg>
    );
};

export default CustomCursor;
