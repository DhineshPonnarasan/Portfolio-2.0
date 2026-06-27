'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion-prefs';

const MOBILE_BREAKPOINT = 768;
const DESKTOP_COUNT = 100;
const MOBILE_COUNT = 30;

type Particle = {
    x: number;
    y: number;
    size: number;
    alpha: number;
    speed: number;
};

const createParticle = (width: number, height: number): Particle => ({
    x: Math.random() * width,
    y: Math.random() * (height + 1),
    size: Math.random() * 3 + 1,
    alpha: Math.random(),
    speed: Math.random() * 0.6 + 0.4,
});

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number | null>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        let width = 0;
        let height = 0;

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const buildParticles = () => {
            const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
            const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
            particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));
        };

        const drawStatic = () => {
            // Reduced-motion: paint once, no animation loop.
            ctx.clearRect(0, 0, width, height);
            for (const p of particlesRef.current) {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);
            for (const p of particlesRef.current) {
                p.y += p.speed;
                if (p.y > height) {
                    p.y = -p.size;
                    p.x = Math.random() * width;
                    p.alpha = Math.random();
                }
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        setSize();
        buildParticles();

        if (reducedMotion) {
            drawStatic();
        } else {
            rafRef.current = requestAnimationFrame(tick);
        }

        const handleResize = () => {
            setSize();
            buildParticles();
            if (reducedMotion) drawStatic();
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('resize', handleResize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [reducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
};

export default ParticleBackground;