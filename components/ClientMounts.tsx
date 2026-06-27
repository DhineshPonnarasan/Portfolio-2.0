'use client';

import dynamic from 'next/dynamic';

// All of these are decorative cosmetic client components that should be
// code-split and skip SSR. We re-export them through a single client
// component to satisfy Next.js' rule that `dynamic({ ssr: false })` can
// only be called from client components.

export const ParticleBackground = dynamic(
    () => import('@/components/ParticleBackground'),
    { ssr: false },
);

export const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
    ssr: false,
});

export const KonamiEasterEgg = dynamic(
    () => import('@/components/KonamiEasterEgg'),
    { ssr: false },
);

export const Preloader = dynamic(() => import('@/components/Preloader'), {
    ssr: false,
});

export const ScrollAnimator = dynamic(
    () => import('@/components/ScrollAnimator'),
    { ssr: false,
});

export const HomeChatWidget = dynamic(
    () => import('@/components/HomeChatWidget'),
    { ssr: false,
});

export const CommandPalette = dynamic(
    () => import('@/components/CommandPalette/CommandPalette'),
    { ssr: false },
);

export const ToastViewport = dynamic(() => import('@/components/Toast'), {
    ssr: false,
});

/**
 * Renders the bundle of decorative client components used by the root layout.
 * Each is dynamically imported and hydrated on the client only.
 */
const ClientMounts = () => (
    <>
        <Preloader />
        <CustomCursor />
        <KonamiEasterEgg />
        <ParticleBackground />
        <ScrollAnimator />
        <HomeChatWidget />
        <CommandPalette />
        <ToastViewport />
    </>
);

export default ClientMounts;
