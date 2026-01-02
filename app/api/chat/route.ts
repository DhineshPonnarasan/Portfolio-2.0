import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import {
    findProject,
    generateArchitectureExplanation,
    buildConceptualArchitectureExplanation,
    buildPortfolioContextSnippet,
} from '@/lib/architecture';

// Initialize Groq client lazily for better performance
let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
    if (!process.env.GROQ_API_KEY) return null;
    if (!groqClient) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    return groqClient;
}

const SYSTEM_PROMPT = `You are Chitti — Dhinesh's virtual assistant on his portfolio website.

ROLE: Answer questions about Dhinesh's background, skills, projects, publications, experience, and general technical topics.

ABOUT DHINESH:
- ML/AI Engineer & Full-stack Developer
- Skills: Python, JavaScript/TypeScript, React, Next.js, FastAPI, TensorFlow, PyTorch, Docker, AWS/GCP, SQL
- 3+ years experience in ML engineering, data pipelines, and full-stack development
- Master's in Information Systems with Applied Data Science from SUNY Binghamton

RESPONSE GUIDELINES:
- Be concise and professional (2-4 sentences for simple questions)
- Use bullet points for lists
- Include specific examples from projects when relevant
- For technical questions, provide actionable insights`;

const MAX_CHAT_HISTORY = 4; // Reduced for faster responses
const OFFLINE_FALLBACK_MESSAGE = "I'm currently offline. Please explore the Projects, Experience, and Skills sections on the portfolio for detailed information about Dhinesh's work.";

const ARCHITECTURE_KEYWORDS = ['architecture', 'diagram', 'system design', 'data flow', 'box', 'workflow'];
const PORTFOLIO_KEYWORDS = ['project', 'projects', 'experience', 'publication', 'compare', 'vs', 'versus', 'skill', 'skills'];

// Cache portfolio context (computed once at module load)
const PORTFOLIO_CONTEXT = buildPortfolioContextSnippet();

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

function extractCandidateMermaid(message: string) {
    const mermaidBlockMatch = message.match(/```mermaid([\s\S]*?)```/i);
    if (!mermaidBlockMatch) return null;
    return mermaidBlockMatch[1].trim();
}

function shouldAttachPortfolioContext(message: string) {
    const lowered = normalize(message);

    const mentionsKeyword = PORTFOLIO_KEYWORDS.some((keyword) => lowered.includes(keyword));
    if (mentionsKeyword) return true;

    let mentionCount = 0;
    PROJECTS.forEach((project) => {
        if (
            lowered.includes(project.slug.toLowerCase()) ||
            lowered.includes(project.title.toLowerCase())
        ) {
            mentionCount += 1;
        }
    });

    return mentionCount > 1;
}

export async function POST(req: Request) {
    try {
        const { messages }: { messages: any } = await req.json();
        const lastMessage = Array.isArray(messages) ? messages[messages.length - 1] : undefined;

        if (lastMessage?.role === 'user') {
            const content = lastMessage.content.trim();
            const lowerContent = content.toLowerCase();

            // Handle special commands
            if (lowerContent.startsWith('explain architecture:') || lowerContent.startsWith('/architecture')) {
                const projectName = lowerContent.startsWith('explain architecture:')
                    ? content.substring('explain architecture:'.length).trim()
                    : content.substring('/architecture'.length).trim();
                return await handleArchitectureCommand(projectName);
            }

            if (lowerContent.startsWith('compare architectures:') || lowerContent.startsWith('/compare')) {
                const payload = lowerContent.startsWith('compare architectures:')
                    ? content.substring('compare architectures:'.length).trim()
                    : content.substring('/compare'.length).trim();
                return await handleCompareCommand(payload);
            }
        }

        // Get Groq client (cached)
        const groq = getGroqClient();
        if (!groq) {
            return streamTextResponse(OFFLINE_FALLBACK_MESSAGE);
        }

        const recentMessages = Array.isArray(messages) ? messages.slice(-MAX_CHAT_HISTORY) : [];
        const lastContent = lastMessage?.content ?? '';
        const { contextMessage } = getArchitectureContext(lastContent);
        const attachPortfolioContext = shouldAttachPortfolioContext(lastContent);

        // Build optimized message array
        const systemMessages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];
        
        if (attachPortfolioContext) {
            systemMessages.push({
                role: 'system',
                content: `Portfolio context:\n${PORTFOLIO_CONTEXT}`,
            });
        }
        
        if (contextMessage) {
            systemMessages.push({ role: 'system', content: contextMessage });
        }

        let chatCompletion;
        try {
            chatCompletion = await groq.chat.completions.create({
                messages: [...systemMessages, ...recentMessages],
                model: 'llama-3.1-8b-instant',
                temperature: 0.6,
                max_tokens: 400,
                top_p: 0.9,
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
        console.error('Chat API error:', error?.message || error);

        if (error?.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
            return handleRateLimit();
        }

        if (isAuthOrKeyError(error)) {
            return streamTextResponse(OFFLINE_FALLBACK_MESSAGE);
        }

        return streamTextResponse("Something went wrong. Please try again.");
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

async function handleCompareCommand(raw: string) {
    const [firstRaw, secondRaw] = raw.split(/vs|,/i).map((part) => part.trim()).filter(Boolean);

    if (!firstRaw || !secondRaw) {
        const hint =
            'To compare, mention two project slugs or titles. Example: "compare architectures: cloud-data-warehouse vs hybrid-recommendation-engine".';
        return streamTextResponse(hint);
    }

    const firstProject = findProject(firstRaw);
    const secondProject = findProject(secondRaw);

    if (!firstProject || !secondProject) {
        return streamTextResponse(
            'I could not match one of those project names. Use the exact slugs from the Projects section when asking for comparisons.',
        );
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/architecture-compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstProjectId: firstProject.id, secondProjectId: secondProject.id }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error((data as any).error || 'Comparison failed.');
        }
        return streamTextResponse(data.comparison);
    } catch (error) {
        console.error('compare command error', error);
        return streamTextResponse(
            'I could not complete that comparison just now. You can still open the dedicated comparison panel from any project page.',
        );
    }
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
