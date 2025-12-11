'use client';

import { Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

const ChatInput = ({ onSend, isLoading, placeholder = "Type a message..." }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input.trim());
        setInput('');
    };

    // Auto-focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center p-2 border-t border-white/10 bg-zinc-900/50">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-500 px-3 py-2 disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    input.trim() && !isLoading 
                        ? "bg-primary text-primary-foreground hover:opacity-90" 
                        : "bg-transparent text-zinc-500 cursor-not-allowed"
                )}
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Send size={18} />
                )}
            </button>
        </form>
    );
};

export default ChatInput;
