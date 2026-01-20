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

const KonamiEasterEgg = () => {
    const [input, setInput] = useState<string[]>([]);
    const [isGodMode, setIsGodMode] = useState(false);
    const { playConfirm } = useCyberSounds();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nextInput = [...input, e.key];
            if (nextInput.length > KONAMI_CODE.length) {
                nextInput.shift();
            }
            setInput(nextInput);

            if (JSON.stringify(nextInput) === JSON.stringify(KONAMI_CODE)) {
                activateGodMode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input]);

    const activateGodMode = () => {
        setIsGodMode((prev) => !prev);
        document.documentElement.classList.toggle('god-mode');
        playConfirm();

        // Visual flair
        if (!document.documentElement.classList.contains('god-mode')) {
            alert("GOD MODE DEACTIVATED");
        } else {
            // Create a glitches overlay or something fun (optional)
            console.log("GOD MODE ACTIVATED");
        }
        setInput([]);
    };

    return null; // Logic only component
};

export default KonamiEasterEgg;
