
import { Groq } from 'groq-sdk';
import { PROJECTS, MY_EXPERIENCE, MY_PUBLICATIONS } from '@/lib/data';
import { ARCHITECTURE_DIAGRAMS } from '@/lib/architecture-diagrams';
import { IProject } from '@/types';

let groqClient: Groq | null = null;

const getGroqClient = () => {
    if (groqClient) return groqClient;

    if (typeof process === 'undefined' || !process.env.GROQ_API_KEY) {
        return null;
    }

    groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    return groqClient;
};

export type ArchitectureMode = 'overview' | 'data' | 'deployment';

export const findProject = (query: string): IProject | undefined => {
    const normalizedQuery = query.toLowerCase().trim();
    return PROJECTS.find(p =>
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.slug.toLowerCase().includes(normalizedQuery)
    );
};

const MODE_DESCRIPTORS: Record<ArchitectureMode, { label: string; focus: string }> = {
    overview: {
        label: 'High-level architecture',
        focus: 'Explain the end-to-end flow from Box 1 → Box 6 at a high level, focusing on responsibilities and interactions.',
    },
    data: {
        label: 'Data pipeline architecture',
        focus: 'Focus on how data moves, is transformed, stored, and validated across Boxes 1 → 6.',
    },
    deployment: {
        label: 'Deployment & runtime architecture',
        focus: 'Focus on runtime topology, services, scaling, and operational boundaries across Boxes 1 → 6.',
    },
};

export const generateArchitecturePrompt = (
    project: IProject,
    diagram: string,
    mode: ArchitectureMode = 'overview',
) => {
    const description = Array.isArray(project.description)
        ? project.description.join(' ')
        : project.description;
    const techStackText = project.techStack?.length
        ? project.techStack.join(', ')
        : project.techAndTechniques?.slice(0, 5).join(', ') ?? 'N/A';

    const { label, focus } = MODE_DESCRIPTORS[mode];

    return `You are a senior software architect explaining this system architecture.

TASK: Explain ${project.title} architecture in the "${label}" view.
FOCUS: ${focus}

STRICT FORMAT REQUIREMENTS:
- Use ONLY bullet points starting with "- " or "• "
- Start each point with the Box number (e.g., "- Box 1:", "• Box 2:")
- One clear sentence per bullet point
- Maximum 6-8 bullet points total
- No paragraphs, no prose, no introductions, no conclusions
- No headers, subheaders, or markdown formatting beyond bullets
- Each bullet must be on its own line
- Reference Box numbers explicitly (Box 1, Box 2, etc.)

Project: ${project.title}
Tech: ${techStackText}

Architecture reference:
${diagram}

Write the bullet-point explanation now (format: "- Box X: description"):`;
};

export async function generateArchitectureExplanation(
    project: IProject,
    mode: ArchitectureMode = 'overview',
) {
    const diagram = ARCHITECTURE_DIAGRAMS[project.id];

    const client = getGroqClient();

    if (!diagram || !client) {
        return buildConceptualArchitectureExplanation(project);
    }

    const prompt = generateArchitecturePrompt(project, diagram, mode);

    try {
        const chatCompletion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are an expert Software Architect.' },
                { role: 'user', content: prompt },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 2048,
        });

        return chatCompletion.choices[0]?.message?.content || buildConceptualArchitectureExplanation(project);
    } catch (error) {
        console.error('Error generating architecture:', error);
        return buildConceptualArchitectureExplanation(project);
    }
}

export function buildConceptualArchitectureExplanation(project?: IProject, requestedName?: string) {
    const title = project?.title || requestedName || 'this system';
    const techList = project?.techAndTechniques || project?.techStack || project?.skills || [];
    const highlightTech = techList.slice(0, 4).join(', ');

    const bullets = [
        `• **Box 1: Data Sources** — Ingests raw data from APIs, databases, and external feeds with schema validation`,
        `• **Box 2: Preprocessing** — Cleans, deduplicates, and normalizes inputs for downstream processing`,
        `• **Box 3: Feature Engineering** — Transforms raw data into ML-ready features with quality checks`,
        `• **Box 4: Model Training** — Trains and validates models with cross-validation and hyperparameter tuning`,
        `• **Box 5: Inference & Serving** — Deploys models via APIs with low-latency scoring`,
        `• **Box 6: Monitoring & Feedback** — Tracks drift, collects feedback, triggers retraining cycles`,
    ];

    if (highlightTech) {
        bullets.push(`• **Tech Stack:** ${highlightTech}`);
    }

    return bullets.join('\n');
}

export function getArchitectureMetadata(projectId: number) {
    const diagram = ARCHITECTURE_DIAGRAMS[projectId];
    if (!diagram) {
        return {
            complexity: 'unknown' as const,
            style: 'Not documented' as const,
        };
    }

    const lineCount = diagram.split('\n').length;
    const arrowCount = (diagram.match(/->|→|↔|↑|↓/g) || []).length;

    const complexity =
        lineCount > 260 || arrowCount > 18
            ? 'complex'
            : lineCount > 180 || arrowCount > 10
            ? 'advanced'
            : 'foundational';

    let style: string = 'General ML / data system';
    const lower = diagram.toLowerCase();

    if (lower.includes('stream') || lower.includes('kafka')) {
        style = 'Streaming / real-time pipeline';
    } else if (lower.includes('warehouse') || lower.includes('dbt') || lower.includes('snowflake')) {
        style = 'Analytics / warehouse pipeline';
    } else if (lower.includes('quantum')) {
        style = 'Hybrid quantum–classical system';
    } else if (lower.includes('yolov8') || lower.includes('vision')) {
        style = 'Computer vision / inference system';
    }

    return {
        complexity,
        style,
    };
}

export function buildPortfolioContextSnippet() {
    const projectLines = PROJECTS.map((p) => `- ${p.title} (${p.slug}) — ${Array.isArray(p.description) ? p.description[0] : p.description}`);
    const experienceLines = MY_EXPERIENCE.map((e) => `- ${e.title} @ ${e.company}`);
    const publicationLines = MY_PUBLICATIONS.map((p) => `- ${p.title} (${p.venue}, ${p.year})`);

    return [
        'Projects:',
        ...projectLines,
        '',
        'Experience:',
        ...experienceLines,
        '',
        'Publications:',
        ...publicationLines,
    ].join('\n');
}
