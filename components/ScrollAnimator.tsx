'use client';

import { useEffect } from 'react';

const ScrollAnimator = () => {
    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>('[data-animate="section"]');
        if (!sections.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const reveal = (element: Element) => element.classList.add('is-visible');

        if (prefersReducedMotion.matches) {
            sections.forEach(reveal);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        reveal(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -10% 0px',
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return null;
};

export default ScrollAnimator;
