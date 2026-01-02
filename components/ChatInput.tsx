'use client';

import { Mic, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

const ChatInput = ({ onSend, isLoading, placeholder = "Talk to Chitti" }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Check if speech recognition is supported
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
            setIsSupported(!!SpeechRecognition);
        }
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported || typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isSupported]);

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
        if (!isSupported || !recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                setIsListening(false);
            }
        }
    };

    // Auto-focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            {/* Green accent line on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60 rounded-l-xl" />
            
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading || isListening}
                className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-xl rounded-l-none outline-none text-sm text-zinc-200 placeholder:text-zinc-500 px-4 py-3 pl-6 disabled:opacity-50 focus:border-primary/50 transition-colors"
            />
            
            {/* Send Button */}
            <button
                type="submit"
                disabled={!input.trim() || isLoading || isListening}
                className={cn(
                    "p-3 rounded-xl transition-all duration-200 shrink-0",
                    input.trim() && !isLoading && !isListening
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
                    "p-3 rounded-xl transition-all duration-200 shrink-0",
                    isListening
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-transparent text-zinc-400 hover:text-primary hover:bg-white/5"
                )}
                title={isListening ? "Stop listening" : "Voice input"}
            >
                <Mic size={20} className={isListening ? "animate-pulse" : ""} />
            </button>
        </form>
    );
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

export default ChatInput;
