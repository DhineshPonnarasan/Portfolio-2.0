'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/lib/motion-prefs';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

/**
 * Wraps a route subtree in a Framer Motion `AnimatePresence mode="wait"`
 * keyed on `usePathname()`. This means outgoing content fully unmounts
 * before incoming content mounts, giving a clean crossfade between routes.
 *
 * Honours `prefers-reduced-motion` by skipping the slide and just rendering
 * the latest children immediately.
 *
 * NOTE: this sits inside the existing GSAP `.page-transition` shell defined
 * by `app/template.tsx`. The two systems compose: the GSAP transition is a
 * single paint-wide sweep; this adds a content-level crossfade on top.
 */
const RouteTransition = ({ children }: Props) => {
    const pathname = usePathname();
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
        return <>{children}</>;
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default RouteTransition;
