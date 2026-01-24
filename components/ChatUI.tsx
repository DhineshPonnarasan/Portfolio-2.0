'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, X, ChevronUp, ChevronDown } from 'lucide-react';
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

const ChatUI = ({ messages, isLoading, onSend, onClear, onClose }: ChatUIProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const scrollToTop = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    // Check scroll position for indicators
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtTop = scrollTop <= 10;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
            
            setShowScrollDown(!isAtBottom && messages.length > 2);
            setShowScrollUp(!isAtTop && messages.length > 2);
        };

        container.addEventListener('scroll', checkScroll);
        checkScroll();

        return () => container.removeEventListener('scroll', checkScroll);
    }, [messages.length]);

    // Prevent scroll propagation to parent - Enhanced
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const delta = e.deltaY;
            const isAtTop = scrollTop <= 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            // Always stop propagation to prevent page scroll
            e.stopPropagation();
            e.preventDefault();

            // Only scroll if we have room to scroll
            if ((delta < 0 && !isAtTop) || (delta > 0 && !isAtBottom)) {
                container.scrollTop += delta;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.stopPropagation();
        };

        // Prevent mouse events from propagating
        const handleMouseEnter = () => {
            document.body.style.overflow = 'hidden';
        };

        const handleMouseLeave = () => {
            document.body.style.overflow = '';
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, isLoading, scrollToBottom]);

    // Filter out system messages and empty messages
    const displayMessages = messages.filter(msg => 
        msg.role !== 'system' && msg.content.trim().length > 0
    );
    const hasConversation = displayMessages.length > 1;

    return (
        <div 
            className="flex flex-col h-full min-h-0 bg-[#1a1a1a] text-zinc-200 rounded-2xl border border-white/5 shadow-2xl overflow-hidden"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1a1a] shrink-0">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border-2 border-primary/30 overflow-hidden ring-2 ring-primary/20">
                        <img 
                            src="/logo/chatbot-avatar.png" 
                            alt="Chatbot Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-base">Chitti</h3>
                        <p className="text-xs text-zinc-400">AI irundhaalum… style Chitti dhaan.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onClear}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0 relative"
                style={{ 
                    touchAction: 'pan-y',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {/* Messages Container */}
                <div className="px-6 space-y-6 pb-6 pt-6">
                    {/* Initial Greeting - Appears once at top, scrolls naturally */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border-2 border-primary/30 mb-4 overflow-hidden ring-4 ring-primary/20 shadow-lg shadow-primary/20">
                            <img 
                                src="/logo/chatbot-avatar.png" 
                                alt="Chatbot Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-semibold text-white text-xl mb-1">Chitti</h3>
                        <p className="text-sm text-zinc-400">Emotion illa. Confusion illa. Solution mattum.</p>
                    </motion.div>

                    {/* Date Separator */}
                    {hasConversation && (
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-zinc-500 font-medium">Today</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>
                    )}

                    {/* Messages */}
                    <AnimatePresence initial={false}>
                        {displayMessages.map((msg, index) => {
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full gap-3",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border border-primary/30 shrink-0 mt-1 overflow-hidden ring-1 ring-primary/20">
                                            <img 
                                                src="/logo/chatbot-avatar.png" 
                                                alt="Chatbot Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-col gap-1 max-w-[75%]">
                                        <div
                                            className={cn(
                                                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                                msg.role === 'user'
                                                    ? "bg-[#0d4d2e] text-white rounded-br-sm"
                                                    : "bg-[#2a2a2a] text-zinc-200 rounded-bl-sm border border-white/5"
                                            )}
                                        >
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
                                        
                                        {/* Delivered status for user messages */}
                                        {msg.role === 'user' && (
                                            <span className="text-xs text-zinc-500 text-right px-1">Delivered</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    
                    {/* Loading Indicator */}
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden ring-1 ring-primary/20">
                                <img 
                                    src="/logo/chatbot-avatar.png" 
                                    alt="Chatbot Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/5 flex gap-1 items-center">
                                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Scroll Up Button */}
                <AnimatePresence>
                    {showScrollUp && (
                        <motion.button
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={scrollToTop}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-30"
                            title="Scroll to top"
                        >
                            <ChevronUp size={16} className="text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Scroll Down Button */}
                <AnimatePresence>
                    {showScrollDown && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={scrollToBottom}
                            className="absolute bottom-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-30"
                            title="Scroll to bottom"
                        >
                            <ChevronDown size={16} className="text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>
                
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-white/10 shrink-0">
                <ChatInput onSend={onSend} isLoading={isLoading} placeholder="Talk to Chitti" />
            </div>
        </div>
    );
};

export default ChatUI;
