'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof Link> {
    back?: boolean;
}

gsap.registerPlugin(useGSAP);

import { useCyberSounds } from '@/hooks/useCyberSounds';

const TransitionLink = ({
    href,
    onClick,
    children,
    back = false,
    ...rest
}: Props) => {
    const router = useRouter();
    const { contextSafe } = useGSAP(() => { });
    const { playHover, playClick } = useCyberSounds();

    const handleLinkClick = contextSafe(
        async (e: React.MouseEvent<HTMLAnchorElement>) => {
            playClick(); // Play sound
            e.preventDefault();

            gsap.set('.page-transition', { yPercent: 100 });
            gsap.set('.page-transition--inner', { yPercent: 100 });

            const tl = gsap.timeline();

            tl.to('.page-transition', {
                yPercent: 0,
                duration: 0.3,
            });

            tl.then(() => {
                if (back) {
                    router.back();
                } else if (href) {
                    router.push(href.toString());
                } else if (onClick) {
                    onClick(e);
                }
            });
        },
    );

    return (
        <Link
            href={href}
            {...rest}
            onClick={handleLinkClick}
            onMouseEnter={playHover} // sound trigger
        >
            {children}
        </Link>
    );
};

export default TransitionLink;
