'use client';
import React, { useEffect, useRef } from 'react';

const ScrollProgressIndicator = () => {
    const scrollBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId: number | null = null;

        const handleScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                if (scrollBarRef.current) {
                    const { scrollHeight, clientHeight } = document.documentElement;
                    const scrollableHeight = scrollHeight - clientHeight;
                    const scrollProgress = (window.scrollY / scrollableHeight) * 100;
                    scrollBarRef.current.style.transform = `translateY(-${
                        100 - scrollProgress
                    }%)`;
                }
                rafId = null;
            });
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="fixed top-[50svh] right-[2%] -translate-y-1/2 w-1.5 h-[100px] rounded-full bg-background-light overflow-hidden">
            <div
                className="w-full bg-primary rounded-full h-full"
                ref={scrollBarRef}
            ></div>
        </div>
    );
};

export default ScrollProgressIndicator;
