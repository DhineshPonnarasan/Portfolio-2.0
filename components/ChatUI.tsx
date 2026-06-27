'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowDown,
    ChevronUp,
    Copy,
    Check,
    Wifi,
    RefreshCw,
    X,
    StopCircle,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from './MermaidDiagram';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/motion-prefs';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatUIProps {
    messages: Message[];
    isLoading: boolean;
    onSend: (_message: string) => void;
    onClear: () => void;
    onClose: () => void;
    /** Called when the user clicks the cancel button mid-stream. */
    onCancel?: () => void;
    /** True when the last assistant message ended with a stream error. */
    hasError?: boolean;
    /** Retry the last user turn. */
    onRetry?: () => void;
}

const SUGGESTED_QUESTIONS = [
    "Where is Dhinesh?",
    "Current company?",
    "Top 5 skills?",
    "Education background?",
    "Work experience?",
    "Show his projects",
    "Contact info?",
    "Recent publications?",
    "Open source contributions?",
];

const COLLAPSE_LINE_COUNT = 12; // Above this, assistant messages get a "show more" toggle.
const MAX_INPUT_CHARS = 1500;    // Mirrors the backend cap so the UI warns before the API rejects.
const ROTATE_EVERY_MS = 5000;
const SUGGESTED_VISIBLE = 3;

const ChatUI = ({
    messages,
    isLoading,
    onSend,
    onClear,
    onClose,
    onCancel,
    hasError,
    onRetry,
}: ChatUIProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCountRef = useRef(0);
    const lastScrollHeightRef = useRef(0);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [showNewMessages, setShowNewMessages] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [inputLength, setInputLength] = useState(0);
    const [expandedMessages, setExpandedMessages] = useState<Record<number, boolean>>({});
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const reducedMotion = useReducedMotion();

    // Rotate the suggested question chips while the conversation is idle.
    useEffect(() => {
        const t = window.setInterval(() => {
            setSuggestionIndex((i) => (i + 1) % SUGGESTED_QUESTIONS.length);
        }, ROTATE_EVERY_MS);
        return () => window.clearInterval(t);
    }, []);

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: reducedMotion || !smooth ? 'auto' : 'smooth',
        });
    }, [reducedMotion]);

    const scrollToTop = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: reducedMotion ? 'auto' : 'smooth',
            });
        }
    }, [reducedMotion]);

    const copyMessage = useCallback((content: string, index: number) => {
        navigator.clipboard.writeText(content).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        }).catch(() => {/* ignore */});
    }, []);

    const copyCodeBlock = useCallback((code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            // No toast — the button's "Copied" state is the indicator.
        }).catch(() => {/* ignore */});
    }, []);

    // Scroll position observer. Throttled via rAF and detects:
    //  - top/bottom indicators (existing behaviour)
    //  - whether to surface the "new messages" pill
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let frame = 0;
        const checkScroll = () => {
            frame = 0;
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtTop = scrollTop <= 10;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;

            setShowScrollDown(!isAtBottom && messages.length > 2);
            setShowScrollUp(!isAtTop && messages.length > 2);
        };
        const schedule = () => {
            if (frame) return;
            frame = requestAnimationFrame(checkScroll);
        };

        container.addEventListener('scroll', schedule, { passive: true });
        checkScroll();

        return () => {
            container.removeEventListener('scroll', schedule);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [messages.length]);

    // Auto-scroll on new messages — but only if the user is already near the
    // bottom. Otherwise show a "↓ new messages" pill so the user can choose.
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const prevCount = lastMessageCountRef.current;
        const newCount = messages.length;
        lastMessageCountRef.current = newCount;

        if (newCount <= prevCount) {
            lastScrollHeightRef.current = container.scrollHeight;
            return;
        }

        const { scrollTop, scrollHeight, clientHeight } = container;
        const wasNearBottom = scrollHeight - scrollTop - clientHeight < 120;

        if (wasNearBottom) {
            // Defer to the next frame so the new message has been rendered.
            requestAnimationFrame(() => scrollToBottom());
            setShowNewMessages(false);
        } else {
            setShowNewMessages(true);
        }

        lastScrollHeightRef.current = container.scrollHeight;
    }, [messages.length, scrollToBottom]);

    // Once we auto-scroll, clear the pill on the next message change.
    useEffect(() => {
        if (!isLoading) {
            // give the final tokens a chance to render before dismissing
            const t = setTimeout(() => setShowNewMessages(false), 400);
            return () => clearTimeout(t);
        }
    }, [isLoading, messages.length]);

    // Lock body scroll while the chat panel is open + intercept wheel events
    // so page scrolling doesn't fight the chat's scroll.
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const delta = e.deltaY;
            const isAtTop = scrollTop <= 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if ((delta < 0 && !isAtTop) || (delta > 0 && !isAtBottom)) {
                e.stopPropagation();
                e.preventDefault();
                container.scrollTop += delta;
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // Esc to close the chat. Only fires when no input element is focused,
    // so users can still type escape sequences inside the textarea freely.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
            onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    // `/` focuses the input unless the user is already typing in another
    // text field. Mirrors the GitHub/Slack convention.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== '/') return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
            if (target && (target as HTMLElement).isContentEditable) return;
            const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                '[data-chat-input]',
            );
            if (input) {
                e.preventDefault();
                input.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Filter out system messages and empty messages
    const displayMessages = useMemo(
        () => messages.filter((msg) => msg.role !== 'system' && msg.content.trim().length > 0),
        [messages],
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border-2 border-primary/30 overflow-hidden ring-2 ring-primary/20">
                        <Image
                            src="/logo/chatbot-avatar.png"
                            alt="Chatbot Avatar"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-white text-base">Chitti</h3>
                            <Wifi size={11} className="text-emerald-400" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-zinc-400">AI irundhaalum… style Chitti dhaan.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasError && onRetry && (
                        <button
                            onClick={onRetry}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Retry last message"
                            aria-label="Retry last message"
                        >
                            <RotateCcw size={18} />
                        </button>
                    )}
                    {isLoading && onCancel && (
                        <button
                            onClick={onCancel}
                            className="p-2 text-zinc-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Stop generating"
                            aria-label="Stop generating"
                        >
                            <StopCircle size={18} />
                        </button>
                    )}
                    <button
                        onClick={onClear}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Refresh chat"
                        aria-label="Refresh chat"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Close chat"
                        aria-label="Close chat"
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
                <div
                    className="px-6 space-y-6 pb-6 pt-6"
                    role="log"
                    aria-live="polite"
                    aria-label="Conversation transcript"
                >
                    {/* Initial Greeting */}
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reducedMotion ? { duration: 0 } : undefined}
                        className="flex flex-col items-center justify-center py-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border-2 border-primary/30 mb-4 overflow-hidden ring-4 ring-primary/20 shadow-lg shadow-primary/20">
                            <Image
                                src="/logo/chatbot-avatar.png"
                                alt="Chatbot Avatar"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-semibold text-white text-xl mb-1">Chitti</h3>
                        <p className="text-sm text-zinc-400">Emotion illa. Confusion illa. Solution mattum.</p>
                    </motion.div>

                    {/* Suggested Questions — rotate 3 at a time while idle. */}
                    {!hasConversation && (
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
                            className="flex flex-col gap-2"
                        >
                            <p className="text-xs text-zinc-500 text-center mb-1">Try asking:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {Array.from({ length: SUGGESTED_VISIBLE }).map((_, offset) => {
                                    const q = SUGGESTED_QUESTIONS[(suggestionIndex + offset) % SUGGESTED_QUESTIONS.length];
                                    return (
                                        <motion.button
                                            key={`${q}-${suggestionIndex + offset}`}
                                            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            onClick={() => onSend(q)}
                                            disabled={isLoading}
                                            className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary/80 hover:bg-primary/10 hover:border-primary/60 hover:text-primary transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {q}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

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
                            const isLast = index === displayMessages.length - 1;
                            const longMessage = msg.content.split('\n').length > COLLAPSE_LINE_COUNT;
                            const isExpanded = !!expandedMessages[index];
                            const visibleContent =
                                longMessage && !isExpanded
                                    ? msg.content.split('\n').slice(0, COLLAPSE_LINE_COUNT).join('\n')
                                    : msg.content;

                            return (
                                <motion.div
                                    key={index}
                                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={reducedMotion ? { duration: 0 } : undefined}
                                    className={cn(
                                        'flex w-full gap-3',
                                        msg.role === 'user' ? 'justify-end' : 'justify-start',
                                    )}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border border-primary/30 shrink-0 mt-1 overflow-hidden ring-1 ring-primary/20">
                                            <Image
                                                src="/logo/chatbot-avatar.png"
                                                alt="Chatbot Avatar"
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1 max-w-[75%]">
                                        <div
                                            className={cn(
                                                'rounded-2xl px-4 py-3 text-sm leading-relaxed break-words',
                                                msg.role === 'user'
                                                    ? 'bg-[#0d4d2e] text-white rounded-br-sm'
                                                    : 'bg-[#2a2a2a] text-zinc-200 rounded-bl-sm border border-white/5',
                                            )}
                                        >
                                            <div className="markdown-content font-sans text-sm">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ node: _node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            if (match && match[1] === 'mermaid') {
                                                                return (
                                                                    <MermaidDiagram
                                                                        chart={String(children).replace(/\n$/, '')}
                                                                    />
                                                                );
                                                            }
                                                            const codeText = String(children).replace(/\n$/, '');
                                                            if (!inline && match) {
                                                                return (
                                                                    <div className="relative group/code my-2">
                                                                        <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto border border-white/10">
                                                                            <code className={className} {...props}>
                                                                                {children}
                                                                            </code>
                                                                        </pre>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => copyCodeBlock(codeText)}
                                                                            className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100 transition-opacity"
                                                                            aria-label="Copy code"
                                                                            title="Copy code"
                                                                        >
                                                                            <Copy size={12} />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <code
                                                                    className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono"
                                                                    {...props}
                                                                >
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        ul: ({ children }) => (
                                                            <ul className="list-disc pl-4 space-y-1 my-2">
                                                                {children}
                                                            </ul>
                                                        ),
                                                        ol: ({ children }) => (
                                                            <ol className="list-decimal pl-4 space-y-1 my-2">
                                                                {children}
                                                            </ol>
                                                        ),
                                                        li: ({ children }) => (
                                                            <li className="leading-relaxed">{children}</li>
                                                        ),
                                                        a: ({ children, href }) => (
                                                            <a
                                                                href={href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline"
                                                            >
                                                                {children}
                                                            </a>
                                                        ),
                                                        p: ({ children }) => (
                                                            <p className="my-1.5 leading-relaxed">{children}</p>
                                                        ),
                                                    }}
                                                >
                                                    {visibleContent}
                                                </ReactMarkdown>
                                            </div>
                                        </div>

                                        {/* Show more / less for long assistant messages. */}
                                        {longMessage && msg.role === 'assistant' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedMessages((prev) => ({
                                                        ...prev,
                                                        [index]: !prev[index],
                                                    }))
                                                }
                                                className="self-start text-xs text-primary/80 hover:text-primary px-1 mt-0.5"
                                            >
                                                {isExpanded ? 'Show less' : 'Show more'}
                                            </button>
                                        )}

                                        {/* Copy button for assistant / Delivered for user */}
                                        {msg.role === 'user' ? (
                                            <span className="text-xs text-zinc-500 text-right px-1">
                                                Delivered
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => copyMessage(msg.content, index)}
                                                className="self-start flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors px-1 mt-0.5"
                                                title="Copy message"
                                                aria-label="Copy message"
                                            >
                                                {copiedIndex === index ? (
                                                    <>
                                                        <Check size={11} className="text-emerald-400" />
                                                        <span className="text-emerald-400">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={11} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Streaming caret on the last assistant message while loading. */}
                                        {isLast && isLoading && msg.role === 'assistant' && (
                                            <span
                                                aria-hidden="true"
                                                className="self-start text-primary text-xs leading-none"
                                            >
                                                ▍
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Loading Indicator (only when the assistant hasn't started streaming yet) */}
                    {isLoading && !displayMessages.some((m) => m.role === 'assistant') && (
                        <motion.div
                            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reducedMotion ? { duration: 0 } : undefined}
                            className="flex justify-start gap-3"
                            role="status"
                            aria-live="polite"
                            aria-label="Chitti is typing"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center border border-primary/30 shrink-0 overflow-hidden ring-1 ring-primary/20">
                                <Image
                                    src="/logo/chatbot-avatar.png"
                                    alt="Chatbot Avatar"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div
                                className={cn(
                                    'bg-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/5 flex gap-1.5 items-center',
                                )}
                                aria-label="Chitti is typing"
                            >
                                <span
                                    className={cn(
                                        'w-2 h-2 rounded-full bg-primary/70',
                                        !reducedMotion && 'animate-typing-dot',
                                    )}
                                    style={{ animationDelay: '0ms' }}
                                />
                                <span
                                    className={cn(
                                        'w-2 h-2 rounded-full bg-primary/70',
                                        !reducedMotion && 'animate-typing-dot',
                                    )}
                                    style={{ animationDelay: '180ms' }}
                                />
                                <span
                                    className={cn(
                                        'w-2 h-2 rounded-full bg-primary/70',
                                        !reducedMotion && 'animate-typing-dot',
                                    )}
                                    style={{ animationDelay: '360ms' }}
                                />
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
                            aria-label="Scroll to top"
                        >
                            <ChevronUp size={16} className="text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* "New messages" pill */}
                <AnimatePresence>
                    {showNewMessages && !showScrollDown && (
                        <motion.button
                            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={() => {
                                scrollToBottom();
                                setShowNewMessages(false);
                            }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity backdrop-blur-sm z-30 text-xs font-medium flex items-center gap-1.5 shadow-lg"
                            aria-label="Jump to new messages"
                        >
                            <ArrowDown size={12} />
                            New messages
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Scroll Down Button */}
                <AnimatePresence>
                    {showScrollDown && (
                        <motion.button
                            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-30"
                            title="Scroll to bottom"
                            aria-label="Scroll to bottom"
                        >
                            <ArrowDown size={16} className="text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-white/10 shrink-0">
                <div className="flex flex-col gap-1">
                    <ChatInput
                        onSend={(text) => {
                            onSend(text);
                            setInputLength(0);
                        }}
                        isLoading={isLoading}
                        placeholder="Talk to Chitti (press / to focus)"
                        onInputChange={setInputLength}
                    />
                    {inputLength > MAX_INPUT_CHARS * 0.8 && (
                        <p
                            className={cn(
                                'text-xs px-2',
                                inputLength >= MAX_INPUT_CHARS
                                    ? 'text-red-400'
                                    : 'text-zinc-500',
                            )}
                            aria-live="polite"
                        >
                            {inputLength} / {MAX_INPUT_CHARS}
                            {inputLength >= MAX_INPUT_CHARS && ' — message is too long to send'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatUI;
