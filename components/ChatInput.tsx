'use client';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
interface ChatInputProps {
    onSend: (_message: string) => void;
    isLoading: boolean;
    placeholder?: string;
}
const ChatInput = ({ onSend, isLoading, placeholder = "Talk to Chitti" }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // We intentionally do NOT cache the recognition instance — we create a fresh
    // one per session to avoid the "already started" / "can't restart" browser bug.
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const finalTranscriptRef = useRef('');
    const manualStopRef = useRef(false); // true when user explicitly clicks the mic to stop
    // Check browser support once
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
            setIsSupported(!!SR);
        }
    }, []);
    // Auto-focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const stopListening = useCallback(() => {
        manualStopRef.current = true;
        try {
            recognitionRef.current?.stop();
        } catch {
            // ignore stop errors
        }
        recognitionRef.current = null;
        setIsListening(false);
    }, []);

    const startListening = useCallback(() => {
        const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;

        setVoiceError(null);
        finalTranscriptRef.current = '';
        manualStopRef.current = false;

        // Always create a fresh instance — avoids "can't re-start" browser bug
        const recognition: SpeechRecognition = new SR();
        recognition.continuous = true;      // keep listening through natural pauses
        recognition.interimResults = true;  // show live transcription
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += t;
                } else {
                    interim += t;
                }
            }
            if (final) {
                finalTranscriptRef.current += final;
            }
            // Show accumulated final + live interim in the input field
            setInput(finalTranscriptRef.current + interim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setVoiceError('Microphone access denied. Please allow microphone in browser settings.');
                stopListening();
            } else if (event.error === 'network') {
                setVoiceError('Network error. Voice recognition needs an internet connection.');
                stopListening();
            } else if (event.error === 'no-speech') {
                // Ignore — browser fires this on long silence with continuous mode;
                // onend will restart recognition automatically below.
            } else {
                setVoiceError('Voice error. Try again.');
                stopListening();
            }
        };

        recognition.onend = () => {
            // If the user didn't manually stop, restart so recording continues
            // indefinitely until they click the mic button themselves.
            if (!manualStopRef.current) {
                try {
                    const next: SpeechRecognition = new SR();
                    next.continuous = true;
                    next.interimResults = true;
                    next.lang = 'en-US';
                    next.onstart = recognition.onstart;
                    next.onresult = recognition.onresult;
                    next.onerror = recognition.onerror;
                    next.onend = recognition.onend;
                    recognitionRef.current = next;
                    next.start();
                    return;
                } catch {
                    // couldn't restart — fall through to clean up
                }
            }
            // Manual stop: leave the transcript in the input for the user to review & send
            setIsListening(false);
            recognitionRef.current = null;
            manualStopRef.current = false;
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            setIsListening(false);
            recognitionRef.current = null;
            setVoiceError('Could not start voice input. Please try again.');
        }
    }, [onSend, stopListening]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleVoiceClick = () => {
        if (!isSupported) {
            setVoiceError('Speech recognition is not supported. Please use Chrome or Edge.');
            return;
        }
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Clear error after 4 seconds
    useEffect(() => {
        if (!voiceError) return;
        const t = setTimeout(() => setVoiceError(null), 4000);
        return () => clearTimeout(t);
    }, [voiceError]);

    return (
        <div className="flex flex-col gap-1">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                {/* Green accent line on left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60 rounded-l-xl" />

                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? '🎙️ Listening...' : placeholder}
                    disabled={isLoading}
                    className={cn(
                        "flex-1 bg-[#2a2a2a] border rounded-xl rounded-l-none outline-none text-sm text-zinc-200 placeholder:text-zinc-500 px-4 py-3 pl-6 disabled:opacity-50 transition-colors",
                        isListening
                            ? "border-red-400/60 placeholder:text-red-300/70 animate-pulse"
                            : "border-white/10 focus:border-primary/50"
                    )}
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={cn(
                        "p-3 rounded-xl transition-all duration-200 shrink-0",
                        input.trim() && !isLoading
                            ? "bg-primary text-primary-foreground hover:opacity-90"
                            : "bg-transparent text-zinc-500 cursor-not-allowed"
                    )}
                    title="Send message"
                >
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Send size={20} />
                    )}
                </button>

                {/* Voice Button */}
                <button
                    type="button"
                    onClick={handleVoiceClick}
                    disabled={isLoading}
                    className={cn(
                        "p-3 rounded-xl transition-all duration-200 shrink-0 relative",
                        isListening
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            : "bg-transparent text-zinc-400 hover:text-primary hover:bg-white/5"
                    )}
                    title={isListening ? "Stop recording" : isSupported ? "Voice input (auto-sends)" : "Voice not supported in this browser"}
                >
                    {isListening ? (
                        <>
                            <MicOff size={20} />
                            {/* Ripple rings while recording */}
                            <span className="absolute inset-0 rounded-xl animate-ping bg-red-400/20 pointer-events-none" />
                        </>
                    ) : (
                        <Mic size={20} />
                    )}
                </button>
            </form>

            {/* Voice error toast */}
            {voiceError && (
                <p className="text-xs text-red-400 px-2 animate-fade-in">{voiceError}</p>
            )}
        </div>
    );
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: ((_ev: Event) => any) | null;
    onresult: ((_ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((_ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((_ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognitionResultList {
    length: number;
    item(_index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    length: number;
    item(_index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

export default ChatInput;
