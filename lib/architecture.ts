
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { IProject } from '@/types';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const findProject = (query: string): IProject | undefined => {
    const normalizedQuery = query.toLowerCase().trim();
    return PROJECTS.find(p => 
        p.title.toLowerCase().includes(normalizedQuery) || 
        p.slug.toLowerCase().includes(normalizedQuery)
    );
};

export const generateArchitecturePrompt = (project: IProject) => {
    return `
You are a Senior Software Architect with 15+ years of experience in distributed systems, AI/ML pipelines, and cloud infrastructure.

Your task is to generate a Master's-level architecture explanation for the following project:

**Project Title:** ${project.title}
**Description:** ${project.description}
**Tech Stack:** ${project.techStack.join(', ')}
**Key Features:** ${project.points ? project.points.join('; ') : 'N/A'}

Please provide a comprehensive technical deep-dive covering:

1.  **High-Level System Architecture:** Explain the overall design pattern (e.g., Microservices, Event-Driven, Monolith, Serverless).
2.  **Data Flow & Pipeline Stages:** Step-by-step breakdown of how data moves through the system.
3.  **ML/DL Model Components (if applicable):** Detail the model architecture, training pipeline, inference optimization, and data preprocessing.
4.  **Backend & Microservices:** Explain the API design, database schema choices, and service communication.
5.  **Deployment & Infrastructure:** Describe the CI/CD pipeline, containerization (Docker/K8s), and cloud services used.

**CRITICAL REQUIREMENT:**
You MUST include a **Mermaid.js** architecture diagram that visually represents the system.
Do NOT say "Not available". You are capable of generating text-based Mermaid code.
The diagram is MANDATORY.

Use the following EXACT format for the diagram:

\`\`\`mermaid
graph TD;
    Client[Client Layer] -->|Request| API[API Gateway];
    API -->|Load Balance| ServiceA[Service A];
    ... (rest of the diagram)
\`\`\`

**Output Format:**
- Start with a Mermaid diagram immediately if possible, or after a brief intro.
- Return CLEAN Markdown.
- Use clear headings (##).
- Be professional, technical, and concise.
- Do not use conversational filler.
`;
};

export async function generateArchitectureExplanation(project: IProject) {
    const prompt = generateArchitecturePrompt(project);

    try {
        let content = '';
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: "You are an expert Software Architect." },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 2048,
        });

        content = chatCompletion.choices[0]?.message?.content || "Failed to generate architecture explanation.";

        // Check if Mermaid diagram is missing
        if (!content.includes('```mermaid')) {
            console.log(`Mermaid diagram missing for ${project.title}. Retrying diagram generation...`);
            
            const diagramPrompt = `
Based on the following project description, generate a valid Mermaid.js architecture diagram.
Project: ${project.title}
Tech Stack: ${project.techStack.join(', ')}

Output ONLY the mermaid code block.

\`\`\`mermaid
graph TD;
...
\`\`\`
`;
            const diagramCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: "You are an expert Software Architect." },
                    { role: 'user', content: diagramPrompt }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.1,
                max_tokens: 1024,
            });

            const diagram = diagramCompletion.choices[0]?.message?.content || '';
            if (diagram.includes('```mermaid')) {
                content = diagram + "\n\n" + content;
            }
        }

        return content;
    } catch (error) {
        console.error("Error generating architecture:", error);
        return "An error occurred while generating the architecture explanation. Please try again later.";
    }
}
