import { useState, useCallback } from 'react';
import { KNOWLEDGE_BASE, ChatHistoryManager, KnowledgeEntry } from './knowledge-base';

export interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    type?: 'text' | 'options';
    options?: string[];
    logId?: string; // Link to the query log
    feedbackGiven?: boolean;
}

export const useChatLogic = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            text: "Hi there! I'm the Chitti, Dhinesh's virtual assistant. How can I help you today?",
            sender: 'bot',
            type: 'options',
            options: ['Experience', 'Skills', 'Contact Info', 'View Projects'],
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const findBestMatch = (input: string): KnowledgeEntry | null => {
        const lowerInput = input.toLowerCase();
        
        // Exact match check first
        const exactMatch = KNOWLEDGE_BASE.find(entry => 
            entry.keywords.some(k => lowerInput === k || lowerInput.includes(` ${k} `) || lowerInput.startsWith(`${k} `) || lowerInput.endsWith(` ${k}`))
        );
        if (exactMatch) return exactMatch;

        // Partial match with scoring
        let bestScore = 0;
        let bestEntry: KnowledgeEntry | null = null;

        KNOWLEDGE_BASE.forEach(entry => {
            let score = 0;
            entry.keywords.forEach(keyword => {
                if (lowerInput.includes(keyword)) score += 1;
            });
            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
            }
        });

        return bestScore > 0 ? bestEntry : null;
    };

    const executeAction = (action: string): { text: string; options?: string[] } => {
        const now = new Date();
        
        switch (action) {
            case 'get_time':
                return {
                    text: `It's currently ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} in your local time.`,
                    options: ['Main Menu']
                };
            case 'get_date':
                return {
                    text: `Today is ${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
                    options: ['Main Menu']
                };
            case 'check_availability':
                // Assuming typical working hours 9 AM - 6 PM
                const hour = now.getHours();
                const isWorkingHours = hour >= 9 && hour < 18;
                const isWeekend = now.getDay() === 0 || now.getDay() === 6;
                
                if (isWorkingHours && !isWeekend) {
                    return {
                        text: "Yes, I'm likely available right now! Feel free to send me an email.",
                        options: ['Send Email', 'Main Menu']
                    };
                } else {
                    return {
                        text: "I might be away from my desk right now (it's outside typical working hours). But drop me an email and I'll get back to you ASAP!",
                        options: ['Send Email', 'Main Menu']
                    };
                }
            default:
                return { text: "I'm processing that request...", options: ['Main Menu'] };
        }
    };

    const processMessage = useCallback(async (text: string) => {
        // 1. Add User Message
        const userMsgId = Date.now().toString();
        const userMsg: Message = {
            id: userMsgId,
            text,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // 2. Process Response (Simulated Delay)
        setTimeout(() => {
            const match = findBestMatch(text);
            let log;
            let botResponse: Message;

            if (match) {
                log = ChatHistoryManager.logQuery(text, 'answered', match.id);
                
                // Handle Dynamic Actions
                let responseText = match.response;
                let responseOptions = match.options;

                if (match.action) {
                    const result = executeAction(match.action);
                    responseText = result.text;
                    responseOptions = result.options || match.options;
                }

                botResponse = {
                    id: (Date.now() + 1).toString(),
                    text: responseText,
                    sender: 'bot',
                    type: 'options',
                    options: responseOptions,
                    logId: log.id
                };
            } else {
                log = ChatHistoryManager.logQuery(text, 'unanswered');
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    text: "I'm not sure about that one. Would you like to send an email to Dhinesh directly?",
                    sender: 'bot',
                    type: 'options',
                    options: ['Send Email', 'Main Menu'],
                    logId: log.id
                };
            }

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    }, []);

    const handleFeedback = (messageId: string, isPositive: boolean) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                if (msg.logId) {
                    ChatHistoryManager.updateFeedback(msg.logId, isPositive ? 'positive' : 'negative');
                }
                return { ...msg, feedbackGiven: true };
            }
            return msg;
        }));
    };

    return {
        messages,
        isTyping,
        processMessage,
        handleFeedback,
        setMessages
    };
};
