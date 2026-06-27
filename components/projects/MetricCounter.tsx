'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion-prefs';

interface Props {
    /** Target numeric value to count up to. */
    value: number;
    /** Number of decimal places to format. Default 0. */
    decimals?: number;
    /** Prefix string (e.g. '+'). */
    prefix?: string;
    /** Suffix string (e.g. '%'). */
    suffix?: string;
    /** Animation duration in ms. Default 1100. */
    durationMs?: number;
    /** Threshold above which the value is rendered with the suffix 'k'. */
    kThreshold?: number;
    className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const formatValue = (n: number, decimals: number, kThreshold: number) => {
    if (kThreshold && n >= kThreshold) {
        return `${(n / 1000).toFixed(1)}k`;
    }
    return n.toFixed(decimals);
};

/**
 * Animated metric counter. Uses `requestAnimationFrame` so it stays on the
 * compositor thread and never triggers React re-renders during the tween
 * (only the displayed text is in state).
 *
 * - Starts when the element scrolls into view (one-shot).
 * - Honours `prefers-reduced-motion` by snapping directly to the final value.
 */
const MetricCounter = ({
    value,
    decimals = 0,
    prefix = '',
    suffix = '',
    durationMs = 1100,
    kThreshold = 0,
    className,
}: Props) => {
    const ref = useRef<HTMLSpanElement | null>(null);
    const reducedMotion = useReducedMotion();
    const [display, setDisplay] = useState<string>(
        reducedMotion ? formatValue(value, decimals, kThreshold) : '0',
    );

    useEffect(() => {
        if (reducedMotion) {
            setDisplay(formatValue(value, decimals, kThreshold));
            return;
        }
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        let cancelled = false;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const step = (now: number) => {
                    if (cancelled) return;
                    const elapsed = now - start;
                    const t = Math.min(1, elapsed / durationMs);
                    const eased = easeOutCubic(t);
                    const current = value * eased;
                    setDisplay(formatValue(current, decimals, kThreshold));
                    if (t < 1) raf = requestAnimationFrame(step);
                };
                raf = requestAnimationFrame(step);
            },
            { threshold: 0.4 },
        );
        observer.observe(el);
        return () => {
            cancelled = true;
            observer.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, [value, decimals, kThreshold, durationMs, reducedMotion]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {display}
            {suffix}
        </span>
    );
};

export default MetricCounter;
