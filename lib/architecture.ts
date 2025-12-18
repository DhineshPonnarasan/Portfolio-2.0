
import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
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

export const generateArchitecturePrompt = (project: IProject, diagram: string) => {
    const description = Array.isArray(project.description)
        ? project.description.join(' ')
        : project.description;
    const techStackText = project.techStack?.length
        ? project.techStack.join(', ')
        : project.techAndTechniques?.slice(0, 5).join(', ') ?? 'N/A';

    return `You are a senior software architect explaining this system in one confident voice.
- Reference the ASCII diagram strictly by Box numbers (1 through 6) and arrows.
- Describe how work flows from Box 1 → Box 6, highlighting why each step exists.
- Use crisp Markdown paragraphs—no Mermaid, no alternate diagrams.
- Stay under 220 words and avoid speculation.

Project Title: ${project.title}
Description: ${description}
Tech Stack: ${techStackText}

ASCII architecture (immutable reference):
${diagram}

Write the explanation.`;
};

export async function generateArchitectureExplanation(project: IProject) {
    const diagram = ARCHITECTURE_DIAGRAMS[project.id];

    if (!diagram || !process.env.GROQ_API_KEY) {
        return buildConceptualArchitectureExplanation(project);
    }

    const prompt = generateArchitecturePrompt(project, diagram);

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: "You are an expert Software Architect." },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 2048,
        });

        return chatCompletion.choices[0]?.message?.content || buildConceptualArchitectureExplanation(project);
    } catch (error) {
        console.error("Error generating architecture:", error);
        return buildConceptualArchitectureExplanation(project);
    }
}

export function buildConceptualArchitectureExplanation(project?: IProject, requestedName?: string) {
    const title = project?.title || requestedName || 'the requested system';
    const description = Array.isArray(project?.description)
        ? project?.description[0]
        : project?.description || '';
    const techList = project?.techAndTechniques || project?.techStack || project?.skills || [];
    const highlightTech = techList.slice(0, 4).join(', ');

    return `Architecture overview for ${title}:
1. **Signals & Sources** — Reliable data ingestion collects telemetry, metrics, and external datasets and validates them for consistency.
2. **Feature Engineering & Processing** — Cleaned inputs are enriched with behavioral, temporal, and contextual features while early quality checks guard drift.
3. **Modeling & Inference** — Ensembles or transformer layers learn the decision boundaries, with automated retraining for evolving workloads.
4. **Serving & Delivery** — Dockerized microservices or FastAPI endpoints expose low-latency results to downstream dashboards.
5. **Observation & Feedback** — Monitoring, alerts, and business review cycles feed corrections back into the pipeline.
${highlightTech ? `Key technologies: ${highlightTech}.` : ''}
${description ? `Summary: ${description}` : ''}`.trim();
}
