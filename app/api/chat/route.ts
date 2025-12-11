import { Groq } from 'groq-sdk';
import { GENERAL_INFO, PROJECTS, MY_EXPERIENCE, MY_STACK, MY_EDUCATION, MY_PUBLICATIONS, MY_CONTRIBUTIONS } from '@/lib/data';
import { findProject, generateArchitectureExplanation } from '@/lib/architecture';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are Chitti, a smart, friendly AI assistant embedded inside Dhinesh Sadhu Subramaniam Ponnarasan's personal portfolio website.
Your goal is to help recruiters and visitors understand Dhinesh's skills, projects, experience, research, and technical abilities.

Here is the context about Dhinesh:

**General Info:**
- Email: ${GENERAL_INFO.email}
- Phone: ${GENERAL_INFO.phone}

**Education:**
${JSON.stringify(MY_EDUCATION, null, 2)}

**Experience:**
${JSON.stringify(MY_EXPERIENCE, null, 2)}

**Projects:**
${JSON.stringify(PROJECTS.map(p => ({ title: p.title, description: p.description, techStack: p.techStack, keyFeatures: p.keyFeatures })), null, 2)}

**Skills:**
${JSON.stringify(MY_STACK, null, 2)}

**Publications:**
${JSON.stringify(MY_PUBLICATIONS, null, 2)}

**Open Source Contributions:**
${JSON.stringify(MY_CONTRIBUTIONS, null, 2)}

**Guidelines:**
- Be professional, helpful, and concise.
- Answer questions directly based on the provided context.
- If you are unsure about something, ask for clarification or state that you don't have that information.
- Do NOT hallucinate or make up facts.
- You can use Markdown for formatting (bold, lists, etc.).
- Keep responses short and engaging, suitable for a chat interface.
- If asked about "Chitti", introduce yourself as Dhinesh's virtual assistant.
`;

export async function POST(req: Request) {
    try {
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is missing in environment variables');
            return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
        }

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // Check for architecture command
        if (lastMessage && lastMessage.role === 'user') {
            const content = lastMessage.content.trim();
            const lowerContent = content.toLowerCase();
            
            if (lowerContent.startsWith('explain architecture:') || lowerContent.startsWith('/architecture')) {
                let projectName = '';
                if (lowerContent.startsWith('explain architecture:')) {
                    projectName = content.substring('explain architecture:'.length).trim();
                } else {
                    projectName = content.substring('/architecture'.length).trim();
                }
                
                const project = findProject(projectName);
                
                if (project) {
                    // Generate explanation
                    const explanation = await generateArchitectureExplanation(project);
                    
                    // Stream the response
                    const stream = new ReadableStream({
                        start(controller) {
                            const encoder = new TextEncoder();
                            controller.enqueue(encoder.encode(explanation));
                            controller.close();
                        }
                    });
                    
                    return new Response(stream, {
                        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
                    });
                } else {
                    // Project not found - stream a specific message
                    const stream = new ReadableStream({
                        start(controller) {
                            const encoder = new TextEncoder();
                            controller.enqueue(encoder.encode(`I couldn't find a project named "${projectName}". Please check the name and try again. You can see the list of projects in the Projects section.`));
                            controller.close();
                        }
                    });
                    
                    return new Response(stream, {
                        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
                    });
                }
            }
        }

        // Ensure messages is an array and take the last 6 for context window
        const recentMessages = Array.isArray(messages) ? messages.slice(-6) : [];

        let chatCompletion;
        try {
            // Try primary model
            chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...recentMessages,
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stop: null,
                stream: true,
            });
        } catch (error: any) {
            // If rate limited, try fallback model
            if (error?.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
                console.warn('Primary model rate limited, switching to fallback model...');
                try {
                    chatCompletion = await groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            ...recentMessages,
                        ],
                        model: 'llama-3.1-8b-instant',
                        temperature: 0.7,
                        max_tokens: 1024,
                        top_p: 1,
                        stop: null,
                        stream: true,
                    });
                } catch (fallbackError: any) {
                    // If fallback also fails with rate limit, throw to outer catch
                    if (fallbackError?.status === 429 || fallbackError?.error?.code === 'rate_limit_exceeded') {
                        throw fallbackError;
                    }
                    console.error('Fallback model error:', fallbackError);
                    throw error; // Throw original error if fallback fails for other reasons
                }
            } else {
                throw error;
            }
        }

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of chatCompletion) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (err) {
                    console.error('Error streaming response:', err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('Error in chat route:', error);

        // Check for rate limit error from Groq API
        if (error?.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
            return handleRateLimit();
        }

        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

function handleRateLimit() {
    const fallbackMessage = "I'm currently experiencing high traffic (Rate Limit Exceeded). Please try again later, or feel free to explore the Projects section manually to learn more about my work!";
    
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(fallbackMessage));
            controller.close();
        }
    });

    return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
    });
}
