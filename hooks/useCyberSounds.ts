import { useAudio } from "@/components/AudioProvider";
import { playClickSound, playConfirmSound, playHoverSound } from "@/lib/audio/synth";
import { useCallback } from "react";

export const useCyberSounds = () => {
    const { isMuted } = useAudio();

    const playHover = useCallback(() => {
        if (!isMuted) playHoverSound();
    }, [isMuted]);

    const playClick = useCallback(() => {
        if (!isMuted) playClickSound();
    }, [isMuted]);

    const playConfirm = useCallback(() => {
        if (!isMuted) playConfirmSound();
    }, [isMuted]);

    return { playHover, playClick, playConfirm };
};
