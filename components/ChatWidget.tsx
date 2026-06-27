'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ChatUI, { Message } from './ChatUI';
import { useLoading } from '@/app/context/LoadingContext';
import { useReducedMotion } from '@/lib/motion-prefs';

import WelcomePopup from './WelcomePopup';

const INITIAL_MESSAGE: Message = {
    role: 'assistant',
    content:
        "Hi there! I'm Chitti — Dhinesh's portfolio chatbot.\n\nAsk me about his projects, open-source work, experience, or how to get in touch. " +
        'Press `/` to focus this input, or hit any chip below to start.',
};

const MAX_CONTEXT_MESSAGES = 10;
const STORAGE_KEY = 'chitti-chat-history-v1';
const WELCOMED_KEY = 'chat:welcomed';

const ChatWidget = () => {
    const { hasLoaded } = useLoading();
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [iconShape, setIconShape] = useState<'circle' | 'square' | 'hexagon'>('circle');
    const [bubblePulse, setBubblePulse] = useState(false);
    const reducedMotion = useReducedMotion();
    // Chat State
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const assistantAppendedRef = useRef(false);
    const abortRef = useRef<AbortController | null>(null);
    // The last user message we sent — kept around so the user can retry.
    const lastUserPromptRef = useRef<string | null>(null);
    // Tracks whether we've hydrated from sessionStorage yet, to avoid
    // re-persisting the seed greeting over a real conversation on mount.
    const hydratedRef = useRef(false);

    // Persist conversation to sessionStorage. Only writes after hydration
    // so the seed greeting doesn't clobber a real saved conversation.
    useEffect(() => {
        if (!hydratedRef.current) return;
        try {
            if (messages.length <= 1) {
                sessionStorage.removeItem(STORAGE_KEY);
            } else {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
            }
        } catch {
            // sessionStorage may be unavailable (private mode, quota); fail silently.
        }
    }, [messages]);

    // Hydrate from sessionStorage once on mount.
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Light runtime guard: keep only valid shapes.
                    const safe = parsed.filter(
                        (m): m is Message =>
                            m &&
                            typeof m === 'object' &&
                            typeof m.content === 'string' &&
                            (m.role === 'user' || m.role === 'assistant' || m.role === 'system'),
                    );
                    if (safe.length > 0) {
                        setMessages(safe);
                    }
                }
            }
        } catch {
            // Ignore — start fresh.
        }
        hydratedRef.current = true;
    }, []);

    // Shape Randomisation & Welcome Popup
    useEffect(() => {
        const shapes: ('circle' | 'square' | 'hexagon')[] = ['circle', 'square', 'hexagon'];
        setIconShape(shapes[Math.floor(Math.random() * shapes.length)]);

        if (hasLoaded) {
            const timer = setTimeout(() => {
                if (!isOpen) {
                    setShowWelcome(true);
                }
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [hasLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

    // One-per-session pulse on the chat bubble, 8s after first paint. The
    // `chat:welcomed` sessionStorage flag ensures we don't repeat the pulse
    // for repeat visitors in the same session. Reduced motion: skip.
    useEffect(() => {
        if (typeof window === 'undefined' || reducedMotion) return;
        let alreadyWelcomed = false;
        try {
            alreadyWelcomed = sessionStorage.getItem(WELCOMED_KEY) === '1';
        } catch {
            /* private mode — let it run */
        }
        if (alreadyWelcomed) return;
        if (isOpen) return;
        const t = window.setTimeout(() => {
            try {
                sessionStorage.setItem(WELCOMED_KEY, '1');
            } catch {
                /* ignore */
            }
            setBubblePulse(true);
            window.setTimeout(() => setBubblePulse(false), 1800);
        }, 8000);
        return () => window.clearTimeout(t);
    }, [isOpen, hasLoaded, reducedMotion]);

    // Handle welcome popup visibility + body scroll lock when chat is toggled
    useEffect(() => {
        if (isOpen) {
            setShowWelcome(false);
            if (window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const appendOrUpdateAssistant = useCallback((content: string) => {
        setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];

            if (!assistantAppendedRef.current || lastMsg?.role !== 'assistant') {
                assistantAppendedRef.current = true;
                updated.push({ role: 'assistant', content });
            } else {
                updated[updated.length - 1] = { ...lastMsg, content };
            }

            return updated;
        });
    }, []);

    const replaceLastAssistant = useCallback((content: string) => {
        setMessages((prev) => {
            const updated = [...prev];
            const idx = updated.length - 1;
            if (updated[idx]?.role === 'assistant') {
                updated[idx] = { ...updated[idx], content };
            } else {
                updated.push({ role: 'assistant', content });
            }
            return updated;
        });
        assistantAppendedRef.current = true;
    }, []);

    const showAssistantError = useCallback((message: string) => {
        replaceLastAssistant(message);
        setHasError(true);
    }, [replaceLastAssistant]);

    /**
     * Parse Server-Sent-Events wire format from a streaming response.
     * The backend emits `data: <text>` lines, optional heartbeats (lines
     * starting with `:`), and a final `data: [DONE]`. Errors are encoded as
     * `data: __ERROR__:<message>` so the client can show a retry.
     */
    const processEventStream = useCallback(
        async (response: Response) => {
            if (!response.body) {
                throw new Error('empty_body');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let done = false;
            let accumulated = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                    // SSE separates events with a blank line.
                    let sepIndex = buffer.indexOf('\n\n');
                    while (sepIndex !== -1) {
                        const event = buffer.slice(0, sepIndex);
                        buffer = buffer.slice(sepIndex + 2);
                        sepIndex = buffer.indexOf('\n\n');

                        // Only handle `data:` lines; ignore comments + heartbeats.
                        const dataLines: string[] = [];
                        for (const line of event.split('\n')) {
                            if (line.startsWith('data:')) {
                                dataLines.push(line.slice(5).trimStart());
                            }
                        }
                        const data = dataLines.join('\n');
                        if (!data) continue;
                        if (data === '[DONE]') {
                            done = true;
                            break;
                        }
                        if (data.startsWith('__ERROR__:')) {
                            // Surface the error and stop processing further events.
                            throw new Error(data.slice('__ERROR__:'.length));
                        }
                        accumulated += data + '\n';
                        appendOrUpdateAssistant(accumulated.trimEnd());
                    }
                }
            }

            // Drain any remaining buffered event.
            if (buffer.trim()) {
                const dataLines: string[] = [];
                for (const line of buffer.split('\n')) {
                    if (line.startsWith('data:')) {
                        dataLines.push(line.slice(5).trimStart());
                    }
                }
                const data = dataLines.join('\n');
                if (data && data !== '[DONE]' && !data.startsWith('__ERROR__:')) {
                    accumulated += data + '\n';
                    appendOrUpdateAssistant(accumulated.trimEnd());
                }
            }

            return accumulated;
        },
        [appendOrUpdateAssistant],
    );

    const sendPrompt = useCallback(
        async (content: string, opts: { isRetry?: boolean } = {}) => {
            const userMessage: Message = { role: 'user', content };
            // Build the message list to POST: keep the seed greeting but
            // don't include `system` roles (they're server-side).
            const baseMessages = opts.isRetry
                ? messages.slice(0, -1) // drop the previous trailing assistant error
                : [...messages, userMessage];

            const updatedMessages = opts.isRetry
                ? baseMessages
                : baseMessages;
            setMessages(updatedMessages);
            setIsLoading(true);
            setHasError(false);
            assistantAppendedRef.current = false;
            lastUserPromptRef.current = content;

            // Cancel any in-flight request before starting a new one.
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: updatedMessages
                            .slice(-MAX_CONTEXT_MESSAGES)
                            .map(({ role, content: c }) => ({ role, content: c })),
                    }),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    let errorText = '';
                    try {
                        errorText = await response.text();
                    } catch {
                        /* ignore body read errors */
                    }
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('Chat API error:', response.status, errorText);
                    }
                    showAssistantError(
                        response.status === 429
                            ? "I'm being asked a lot of questions right now. Please give me a moment and try again."
                            : "I'm having trouble answering right now due to a server error. Please try again in a moment.",
                    );
                    return;
                }

                if (!response.body) {
                    showAssistantError("I got an empty response from the server. Please try again.");
                    return;
                }

                await processEventStream(response);

                if (!assistantAppendedRef.current) {
                    appendOrUpdateAssistant("I couldn't generate a response. Please try again.");
                    setHasError(true);
                }
            } catch (error) {
                if ((error as Error)?.name === 'AbortError') {
                    // User-initiated cancel. Leave whatever was streamed so far.
                    return;
                }
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Chat Error:', error);
                }
                const reason = (error as Error)?.message;
                showAssistantError(
                    reason && reason !== 'empty_body'
                        ? reason
                        : "I'm having trouble connecting right now. Please try again later.",
                );
            } finally {
                if (abortRef.current === controller) {
                    abortRef.current = null;
                }
                setIsLoading(false);
            }
        },
        [messages, processEventStream, showAssistantError, appendOrUpdateAssistant],
    );

    const handleSend = useCallback(
        (content: string) => {
            sendPrompt(content);
        },
        [sendPrompt],
    );

    const handleCancel = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        setIsLoading(false);
    }, []);

    const handleRetry = useCallback(() => {
        const last = lastUserPromptRef.current;
        if (last) {
            sendPrompt(last, { isRetry: true });
        }
    }, [sendPrompt]);

    const handleClear = useCallback(() => {
        // Abort any in-flight request and reset state.
        abortRef.current?.abort();
        abortRef.current = null;
        setMessages([INITIAL_MESSAGE]);
        setIsLoading(false);
        setHasError(false);
        assistantAppendedRef.current = false;
        lastUserPromptRef.current = null;
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    }, []);

    if (!hasLoaded) return null;

    return (
        <div className="chat-widget-root">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[50] w-[calc(100vw-32px)] md:w-[400px] h-[calc(100svh-100px)] md:h-[600px] flex flex-col isolate"
                        style={{
                            touchAction: 'none',
                            overscrollBehavior: 'contain',
                        }}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-label="Chat with Chitti"
                    >
                        <div className="flex-1 overflow-hidden relative h-full min-h-0">
                            <ChatUI
                                messages={messages}
                                isLoading={isLoading}
                                onSend={handleSend}
                                onClear={handleClear}
                                onClose={() => setIsOpen(false)}
                                onCancel={handleCancel}
                                onRetry={handleRetry}
                                hasError={hasError}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isOpen && (
                    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[49] flex flex-col items-end gap-4">
                        <WelcomePopup
                            message="Hi, I'm Chitti the Chatbot. Speed 1 terahertz, memory 1 zigabyte. I'm here to help you learn about Dhinesh and answer any questions you have."
                            isVisible={showWelcome}
                            onClose={() => setShowWelcome(false)}
                            duration={8000}
                            theme="modern"
                            position="bottom-right"
                        />

                        <motion.button
                            onClick={() => setIsOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={cn(
                                'w-12 h-12 sm:w-14 sm:h-14 bg-primary text-black shadow-lg shadow-primary/20 flex items-center justify-center transition-all duration-300 group relative overflow-hidden',
                                iconShape === 'circle' && 'rounded-full',
                                iconShape === 'square' && 'rounded-2xl',
                                iconShape === 'hexagon' && 'clip-path-hexagon',
                                bubblePulse && 'ring-4 ring-primary/60 ring-offset-2 ring-offset-black',
                            )}
                            style={
                                iconShape === 'hexagon'
                                    ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }
                                    : {}
                            }
                            aria-label="Open chat with Chitti"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-inherit" />
                            <MessageCircle size={26} className="relative z-10" />

                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3" aria-hidden="true">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
