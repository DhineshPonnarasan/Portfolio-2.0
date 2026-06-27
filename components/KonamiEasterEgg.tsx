'use client';
import { useEffect, useState } from 'react';
import { useCyberSounds } from '@/hooks/useCyberSounds';

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];
const STORAGE_KEY = 'konami:unlocked';

const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((val, idx) => val === b[idx]);

const KonamiEasterEgg = () => {
    const [input, setInput] = useState<string[]>([]);
    const { playConfirm } = useCyberSounds();

    // Restore the persisted unlocked state from sessionStorage on mount so
    // god-mode sticks across route changes within the same session.
    useEffect(() => {
        try {
            if (sessionStorage.getItem(STORAGE_KEY) === '1') {
                document.documentElement.classList.add('god-mode');
            }
        } catch {
            /* private mode — fail open */
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nextInput = [...input, e.key];
            if (nextInput.length > KONAMI_CODE.length) {
                nextInput.shift();
            }
            setInput(nextInput);

            if (arraysEqual(nextInput, KONAMI_CODE)) {
                activateGodMode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input]);

    const activateGodMode = () => {
        document.documentElement.classList.toggle('god-mode');
        const isActive = document.documentElement.classList.contains('god-mode');
        try {
            if (isActive) sessionStorage.setItem(STORAGE_KEY, '1');
            else sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
        playConfirm();
        setInput([]);
    };

    return null; // Logic only component
};

export default KonamiEasterEgg;
