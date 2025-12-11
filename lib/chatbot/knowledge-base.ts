import { GENERAL_INFO } from '@/lib/data';

export interface KnowledgeEntry {
    id: string;
    keywords: string[];
    response: string;
    options?: string[];
    category: 'general' | 'technical' | 'contact' | 'projects';
    version: number;
    action?: 'get_time' | 'get_date' | 'check_availability' | 'get_github_stats';
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
    {
        id: 'greeting',
        keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
        response: "Hello! 👋 I'm Chitti, Dhinesh's virtual assistant. How can I help you today?",
        options: ['Experience', 'Skills', 'Contact Info'],
        category: 'general',
        version: 1,
    },
    {
        id: 'time',
        keywords: ['time', 'clock', 'hour'],
        response: "", // Dynamic
        category: 'general',
        version: 1,
        action: 'get_time',
    },
    {
        id: 'date',
        keywords: ['date', 'day', 'today', 'month', 'year'],
        response: "", // Dynamic
        category: 'general',
        version: 1,
        action: 'get_date',
    },
    {
        id: 'availability',
        keywords: ['available', 'working', 'busy', 'free', 'online'],
        response: "", // Dynamic
        category: 'general',
        version: 1,
        action: 'check_availability',
    },
    {
        id: 'projects',
        keywords: ['project', 'work', 'portfolio', 'built', 'create', 'develop'],
        response: "I've worked on several exciting projects including Financial Fraud Detection and Medical Imaging AI. You can view them in the Projects section.",
        options: ['View Projects', 'Main Menu'],
        category: 'projects',
        version: 1,
    },
    {
        id: 'contact',
        keywords: ['contact', 'email', 'hire', 'reach', 'touch', 'call', 'phone'],
        response: `You can email me at ${GENERAL_INFO.email}. I'm also available on LinkedIn!`,
        options: ['Copy Email', 'Main Menu'],
        category: 'contact',
        version: 1,
    },
    {
        id: 'skills',
        keywords: ['skill', 'stack', 'tech', 'technology', 'language', 'framework', 'react', 'python', 'aws'],
        response: "I specialize in Python, TypeScript, React, Next.js, and Cloud technologies (AWS). I'm comfortable with both frontend and backend development.",
        options: ['Experience', 'Main Menu'],
        category: 'technical',
        version: 1,
    },
    {
        id: 'resume',
        keywords: ['resume', 'cv', 'download', 'pdf'],
        response: "You can download my resume using the button below (placeholder).",
        options: ['Download Resume', 'Main Menu'],
        category: 'general',
        version: 1,
    },
    {
        id: 'experience',
        keywords: ['experience', 'background', 'history', 'job', 'work'],
        response: "I have experience as an AI/ML Engineer and Applications Developer. I've worked on scalable applications, research-driven solutions, and open-source contributions.",
        options: ['Skills', 'View Projects', 'Main Menu'],
        category: 'general',
        version: 1,
    },
];

export interface QueryLog {
    id: string;
    timestamp: number;
    query: string;
    responseId?: string;
    status: 'answered' | 'unanswered' | 'escalated';
    feedback?: 'positive' | 'negative';
}

export class ChatHistoryManager {
    private static STORAGE_KEY = 'chat_session_logs';

    static logQuery(query: string, status: QueryLog['status'], responseId?: string): QueryLog {
        const log: QueryLog = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            query,
            responseId,
            status,
        };

        const logs = this.getLogs();
        logs.push(log);
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        }
        return log;
    }

    static getLogs(): QueryLog[] {
        if (typeof window === 'undefined') return [];
        const logs = localStorage.getItem(this.STORAGE_KEY);
        return logs ? JSON.parse(logs) : [];
    }

    static updateFeedback(logId: string, feedback: 'positive' | 'negative') {
        const logs = this.getLogs();
        const index = logs.findIndex(l => l.id === logId);
        if (index !== -1) {
            logs[index].feedback = feedback;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        }
    }
}
