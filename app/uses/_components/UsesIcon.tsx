'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

interface Props {
    slug: string;
    name: string;
}

/**
 * Lazily renders a Simple Icons icon. We use `next/dynamic` so the entire
 * simple-icons package (~hundreds of SVGs) never lands in the home page
 * chunk. We additionally gate the import behind an IntersectionObserver
 * so icons below the fold don't fetch until they're about to scroll in.
 */
const SimpleIcon = dynamic(() => import('./SimpleIconLoader').then((m) => m.SimpleIconLoader), {
    ssr: false,
    loading: () => <span className="block size-6 rounded-md bg-white/[0.05]" aria-hidden="true" />,
});

const UsesIcon = ({ slug, name }: Props) => {
    const ref = useRef<HTMLSpanElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { rootMargin: '200px' },
        );
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <span
            ref={ref}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/80"
            aria-label={`${name} icon`}
        >
            {visible ? (
                <SimpleIcon slug={slug} name={name} />
            ) : (
                <span className="block size-5 rounded bg-white/[0.05]" aria-hidden="true" />
            )}
        </span>
    );
};

export default UsesIcon;
