'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ChatUI, { Message } from './ChatUI';
import { useLoading } from '@/app/context/LoadingContext';

import WelcomePopup from './WelcomePopup';

const INITIAL_MESSAGE: Message = {
    role: 'assistant',
    content: "Hi, I am Chitti — Dhinesh’s Virtual Assistant.\n\nAsk me anything about his projects, skills, or experience.",
};

const ChatWidget = () => {
    const { isLoading: isPreloaderLoading, hasLoaded } = useLoading();
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [iconShape, setIconShape] = useState<'circle' | 'square' | 'hexagon'>('circle');
    
    // Chat State
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);

    // Shape Randomization & Welcome Popup
    useEffect(() => {
        // Randomize shape on load
        const shapes: ('circle' | 'square' | 'hexagon')[] = ['circle', 'square', 'hexagon'];
        setIconShape(shapes[Math.floor(Math.random() * shapes.length)]);

        if (hasLoaded) {
            // Show welcome popup ONCE after preloader finishes
            // Delay slightly to let the page reveal
            const timer = setTimeout(() => {
                if (!isOpen) {
                    setShowWelcome(true);
                }
            }, 500); // Reduced delay for faster appearance

            // WelcomePopup handles its own auto-hide logic based on duration prop
            // We just need to sync the state if it closes itself
            
            return () => {
                clearTimeout(timer);
            };
        }
    }, [hasLoaded]); // Depend on hasLoaded instead of isPreloaderLoading

    // Handle welcome popup visibility when chat is toggled
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

    const handleSend = async (content: string) => {
        // Add user message
        const userMessage: Message = { role: 'user', content };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Create placeholder for assistant response
            setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulatedContent = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });
                accumulatedContent += chunkValue;

                // Update the last message (assistant's response) with new content
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant') {
                        lastMsg.content = accumulatedContent;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render until content has started loading
    if (!hasLoaded) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-4 right-4 z-[50] w-[calc(100vw-32px)] md:w-[400px] h-[calc(100svh-100px)] md:h-[600px] flex flex-col"
                    >
                        {/* Chat UI */}
                        <div className="flex-1 overflow-hidden relative h-full">
                            <ChatUI 
                                messages={messages} 
                                isLoading={isLoading} 
                                onSend={handleSend} 
                                onClear={() => setMessages([INITIAL_MESSAGE])}
                                onClose={() => setIsOpen(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isOpen && (
                    <div className="fixed bottom-6 right-6 z-[49] flex flex-col items-end gap-4">
                        <WelcomePopup 
                            message="Hi, I'm Chitti the Chatbot. Speed 1 terahertz, memory 1 zigabyte. I'm here to help you."
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
                                "w-14 h-14 bg-primary text-black shadow-lg shadow-primary/20 flex items-center justify-center transition-all duration-300 group relative overflow-hidden",
                                iconShape === 'circle' && "rounded-full",
                                iconShape === 'square' && "rounded-2xl",
                                iconShape === 'hexagon' && "clip-path-hexagon" // You might need a custom class for hexagon clip-path
                            )}
                            style={iconShape === 'hexagon' ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : {}}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-inherit" />
                            <MessageCircle size={26} className="relative z-10" />
                            
                            {/* Ping animation */}
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
