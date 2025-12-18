'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { WheelEvent } from 'react';
import { Bot, User, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from './MermaidDiagram';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatUIProps {
    messages: Message[];
    isLoading: boolean;
    onSend: (message: string) => void;
    onClear: () => void;
    onClose: () => void;
}

const SUGGESTIONS = [
    "Summarize my experience for a recruiter",
    "List technical skills",
    "Explain architecture: customer-churn-intelligence",
    "Explain architecture: hybrid-recommendation-engine",
    "How does Box 3 inform Box 4 in the fraud engine?",
    "Where could latency creep in between Box 4 and Box 5 of the YOLOv8 system?"
];

const ChatUI = ({ messages, isLoading, onSend, onClear, onClose }: ChatUIProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const delta = event.deltaY;
        const isAtTop = container.scrollTop <= 0;
        const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
        const canScrollUp = delta < 0 && !isAtTop;
        const canScrollDown = delta > 0 && !isAtBottom;

        if (!canScrollDown && !canScrollUp) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        container.scrollTop += delta;
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, isLoading]);

    return (
        <div className="flex flex-col h-full min-h-0 bg-zinc-950/95 backdrop-blur-sm text-zinc-200 rounded-2xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/20 text-primary">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Chitti</h3>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={onClear}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Clear Chat"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Close Chat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0 touch-auto"
                style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
                onWheel={handleWheel}
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-zinc-800 text-zinc-100 rounded-bl-none border border-white/5"
                                )}
                            >
                                {/* Render Markdown content */}
                                <div className="markdown-content font-sans text-sm">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({node, inline, className, children, ...props}: any) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                if (match && match[1] === 'mermaid') {
                                                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                                                }
                                                return !inline && match ? (
                                                    <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto my-2 border border-white/10">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                ) : (
                                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            ul: ({children}) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                                            ol: ({children}) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                                            a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5 flex gap-1 items-center">
                            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                
                {/* Suggestions (Only if chat is empty or just started) */}
                {messages.length < 2 && !isLoading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                    >
                        <div className="max-h-40 overflow-y-auto pr-1">
                            <div className="flex flex-col md:flex-row flex-wrap gap-2">
                                {SUGGESTIONS.map((suggestion, idx) => (
                                    <motion.button
                                        key={suggestion}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 * idx }}
                                        onClick={() => onSend(suggestion)}
                                        className="text-left md:text-center px-4 py-2 rounded-md bg-zinc-800/50 border border-white/5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-white/20 hover:shadow-md transition-all duration-200"
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 pt-2 bg-zinc-900/50 border-t border-white/10 shrink-0">
                <ChatInput onSend={onSend} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default ChatUI;
