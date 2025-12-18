import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { findProject, generateArchitectureExplanation, buildConceptualArchitectureExplanation } from '@/lib/architecture';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an Chitti for Dhinesh Sadhu Subramaniam Ponnarasan's portfolio website.

**About Dhinesh:**
- Full-stack developer with expertise in ML/AI, data engineering, and web development
- Skills: Python, JavaScript/TypeScript, React, Next.js, Node.js, FastAPI, TensorFlow, PyTorch, Docker, AWS/GCP
- Experience: 3+ years in ML engineering, data pipelines, and full-stack development
- Education: Computer Science graduate with focus on AI/ML

**Key Projects:**
- Customer Churn Intelligence (ML prediction system)
- Brain Tumor Classification (CNN-based medical imaging)
- Social Media Sentiment Analysis (NLP pipeline)
- Financial Fraud Detection (real-time anomaly detection)
- Hybrid Recommendation Engine (collaborative filtering)
- Cloud Data Warehouse (AWS Redshift, ETL pipelines)

**Guidelines:**
- Be professional, helpful, and concise
- Answer based on Dhinesh's actual background
- Use Markdown for formatting
- Keep responses under 200 words
- If unsure, say you don't have that information`;

const MAX_CHAT_HISTORY = 6;
const OFFLINE_FALLBACK_MESSAGE = "AI is temporarily offline — here's a static explanation instead. In the meantime, you can explore the Projects, Experience, Education, and Publications sections for rich detail.";

const ARCHITECTURE_KEYWORDS = ['architecture', 'diagram', 'system design', 'data flow', 'box', 'workflow'];

const normalize = (value: string) => value.toLowerCase();

function detectProjectMention(content: string) {
    const lowered = normalize(content);
    return PROJECTS.find((project) => {
        const titleMatch = lowered.includes(project.title.toLowerCase());
        const slugMatch = lowered.includes(project.slug.toLowerCase());
        return titleMatch || slugMatch;
    });
}

function getArchitectureContext(message: string) {
    const lowered = normalize(message);
    const mentionsArchitecture = ARCHITECTURE_KEYWORDS.some((keyword) => lowered.includes(keyword));

    if (!mentionsArchitecture) {
        return { projectForContext: undefined, contextMessage: null } as const;
    }

    const project = detectProjectMention(message);
    if (!project) {
        return { projectForContext: undefined, contextMessage: null } as const;
    }

    const diagram = ARCHITECTURE_DIAGRAMS[project.id];
    if (!diagram) {
        return { projectForContext: project, contextMessage: null } as const;
    }

    const contextMessage = `Architecture reference for ${project.title}.
- The system diagram is the single source of truth. Never redraw it.
- Cite Box numbers (1→6) when answering architecture questions.

System diagram:
${diagram}`;

    return { projectForContext: project, contextMessage } as const;
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = Array.isArray(messages) ? messages[messages.length - 1] : undefined;

        if (lastMessage?.role === 'user') {
            const content = lastMessage.content.trim();
            const lowerContent = content.toLowerCase();

            if (lowerContent.startsWith('explain architecture:') || lowerContent.startsWith('/architecture')) {
                const projectName = lowerContent.startsWith('explain architecture:')
                    ? content.substring('explain architecture:'.length).trim()
                    : content.substring('/architecture'.length).trim();

                return await handleArchitectureCommand(projectName);
            }
        }

        if (!process.env.GROQ_API_KEY) {
            return streamTextResponse(OFFLINE_FALLBACK_MESSAGE);
        }

        const recentMessages = Array.isArray(messages) ? messages.slice(-MAX_CHAT_HISTORY) : [];
        const { contextMessage } = getArchitectureContext(lastMessage?.content ?? '');

        let chatCompletion;
        try {
            chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...(contextMessage ? [{ role: 'system', content: contextMessage }] : []),
                    ...recentMessages,
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 512,
                top_p: 1,
                stop: null,
                stream: true,
            });
        } catch (error: any) {
            if (error?.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
                return handleRateLimit();
            }
            if (isAuthOrKeyError(error)) {
                return streamTextResponse(OFFLINE_FALLBACK_MESSAGE);
            }
            throw error;
        }

        return streamGroqCompletion(chatCompletion);
    } catch (error: any) {
        console.error('Error in chat route:', error);

        if (error?.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
            return handleRateLimit();
        }

        if (isAuthOrKeyError(error)) {
            return streamTextResponse(OFFLINE_FALLBACK_MESSAGE);
        }

        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleArchitectureCommand(projectName: string) {
    const normalized = projectName.trim();
    const project = findProject(normalized);

    if (!project) {
        const explanation = buildConceptualArchitectureExplanation(undefined, normalized);
        return streamTextResponse(explanation);
    }

    const explanation = await generateArchitectureExplanation(project);
    return streamTextResponse(explanation);
}

function streamTextResponse(text: string) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(text));
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}

function streamGroqCompletion(chatCompletion: AsyncIterable<any>) {
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of chatCompletion) {
                    const content = chunk.choices?.[0]?.delta?.content || '';
                    if (content) controller.enqueue(encoder.encode(content));
                }
            } catch (error) {
                console.error('Error streaming response:', error);
                controller.error(error);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}

function isAuthOrKeyError(error: any) {
    return (
        error?.status === 401 ||
        error?.status === 403 ||
        error?.error?.code === 'invalid_api_key' ||
        (typeof error?.message === 'string' && error.message.toLowerCase().includes('invalid api key'))
    );
}

function handleRateLimit() {
    const fallbackMessage = "I'm currently experiencing high traffic (Rate Limit Exceeded). Please try again later, or feel free to explore the Projects section manually to learn more about my work!";
    return streamTextResponse(fallbackMessage);
}
