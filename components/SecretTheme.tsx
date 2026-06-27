'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion-prefs';

const SECRET = 'dhinesh';
const STYLE_ID = 'secret-theme-style';
const ACTIVE_CLASS = 'secret-theme-active';

/**
 * Listens for the secret word being typed anywhere on the page (outside
 * editable elements). When matched, applies a CSS-class swap on <html>
 * that re-tints the green accent + emits a one-shot confetti burst.
 *
 * The CSS rules live in `app/globals.css` under the `[data-secret-theme]`
 * selector. Reduced motion: skip the confetti.
 */
const SecretTheme = () => {
    const bufferRef = useRef('');
    const [armed, setArmed] = useState(false);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (target) {
                const tag = target.tagName;
                if (
                    tag === 'INPUT' ||
                    tag === 'TEXTAREA' ||
                    target.isContentEditable
                ) {
                    return;
                }
            }
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.key === 'Backspace') {
                bufferRef.current = bufferRef.current.slice(0, -1);
                return;
            }
            if (e.key.length !== 1) return;
            bufferRef.current = (bufferRef.current + e.key).slice(-SECRET.length);
            if (bufferRef.current === SECRET) {
                setArmed(true);
                bufferRef.current = '';
                if (!reducedMotion) launchConfetti();
                window.setTimeout(() => setArmed(false), 5000);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [reducedMotion]);

    // Toggle the secret theme class on <html>.
    useEffect(() => {
        const root = document.documentElement;
        if (armed) {
            root.setAttribute('data-secret-theme', 'on');
            root.classList.add(ACTIVE_CLASS);
            return () => {
                root.removeAttribute('data-secret-theme');
                root.classList.remove(ACTIVE_CLASS);
            };
        }
        return undefined;
    }, [armed]);

    return null;
};

const COLORS = ['#00FF66', '#22D3EE', '#FACC15', '#F472B6'];

function launchConfetti() {
    if (typeof document === 'undefined') return;
    const layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = [
        'position:fixed',
        'inset:0',
        'pointer-events:none',
        'z-index:300',
        'overflow:hidden',
    ].join(';');
    const N = 80;
    for (let i = 0; i < N; i++) {
        const dot = document.createElement('span');
        const color = COLORS[i % COLORS.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const size = 4 + Math.random() * 6;
        dot.style.cssText = [
            `position:absolute`,
            `left:${left}%`,
            `top:-12px`,
            `width:${size}px`,
            `height:${size * 0.4}px`,
            `background:${color}`,
            `border-radius:1px`,
            `transform:translateY(0) rotate(${Math.random() * 360}deg)`,
            `animation:confettiFall 1600ms ${delay}s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        ].join(';');
        layer.appendChild(dot);
    }
    document.body.appendChild(layer);

    // Inject keyframes once
    if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement('style');
        s.id = STYLE_ID;
        s.textContent = `@keyframes confettiFall {
            to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }`;
        document.head.appendChild(s);
    }

    window.setTimeout(() => layer.remove(), 2200);
}

export default SecretTheme;
