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

const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((val, idx) => val === b[idx]);

const KonamiEasterEgg = () => {
    const [input, setInput] = useState<string[]>([]);
    const { playConfirm } = useCyberSounds();

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
        playConfirm();

        // Visual flair
        if (!document.documentElement.classList.contains('god-mode')) {
            console.log('GOD MODE DEACTIVATED');
        } else {
            console.log('GOD MODE ACTIVATED');
        }
        setInput([]);
    };

    return null; // Logic only component
};

export default KonamiEasterEgg;
