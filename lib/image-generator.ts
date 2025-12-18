
import fs from 'fs';
import path from 'path';
import { Groq } from 'groq-sdk';
import { IProject, VisualAsset } from '../types';
import { VISUAL_PROMPT_TEMPLATE } from './visuals-template';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const ensureDirectoryExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const generateFallbackSVG = (prompt: string, type: string, title: string): string => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
    const primaryColor = colors[Math.floor(Math.random() * colors.length)];
    const secondaryColor = colors[Math.floor(Math.random() * colors.length)];
    
    // UI Mockup Template
    if (type === 'UI Screenshot') {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" style="background-color: #18181b;">
            <!-- Window Frame -->
            <rect x="50" y="50" width="1100" height="700" rx="12" fill="#27272a" stroke="#3f3f46" stroke-width="2"/>
            <!-- Window Header -->
            <path d="M50 62 A 12 12 0 0 1 62 50 L 1138 50 A 12 12 0 0 1 1150 62 L 1150 90 L 50 90 Z" fill="#3f3f46"/>
            <circle cx="80" cy="70" r="6" fill="#ef4444"/>
            <circle cx="100" cy="70" r="6" fill="#f59e0b"/>
            <circle cx="120" cy="70" r="6" fill="#10b981"/>
            
            <!-- Sidebar -->
            <rect x="50" y="90" width="200" height="660" fill="#27272a" stroke-right="#3f3f46"/>
            <rect x="70" y="120" width="160" height="20" rx="4" fill="${primaryColor}" opacity="0.2"/>
            <rect x="70" y="160" width="140" height="12" rx="2" fill="#52525b"/>
            <rect x="70" y="190" width="140" height="12" rx="2" fill="#52525b"/>
            <rect x="70" y="220" width="140" height="12" rx="2" fill="#52525b"/>

            <!-- Content Area -->
            <text x="280" y="140" font-family="sans-serif" font-size="24" fill="white" font-weight="bold">${title}</text>
            
            <!-- Dashboard Widgets -->
            <rect x="280" y="170" width="250" height="150" rx="8" fill="#3f3f46"/>
            <rect x="560" y="170" width="250" height="150" rx="8" fill="#3f3f46"/>
            <rect x="840" y="170" width="250" height="150" rx="8" fill="#3f3f46"/>
            
            <!-- Chart Placeholder -->
            <rect x="280" y="350" width="810" height="300" rx="8" fill="#18181b" stroke="#3f3f46"/>
            <path d="M300 600 L 400 500 L 500 550 L 600 450 L 700 480 L 800 380 L 900 420 L 1000 350" fill="none" stroke="${primaryColor}" stroke-width="3"/>
        </svg>`;
    }

    // Architecture Diagram Template
    if (type === 'System Architecture Diagram') {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" style="background-color: #0f172a;">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
                </marker>
            </defs>
            <text x="400" y="50" text-anchor="middle" font-family="sans-serif" font-size="24" fill="white">${title} Architecture</text>
            
            <!-- Client -->
            <rect x="50" y="250" width="120" height="80" rx="8" fill="#1e293b" stroke="${primaryColor}" stroke-width="2"/>
            <text x="110" y="295" text-anchor="middle" fill="white" font-family="sans-serif">Client</text>
            
            <!-- API Gateway -->
            <rect x="250" y="250" width="120" height="80" rx="8" fill="#1e293b" stroke="${secondaryColor}" stroke-width="2"/>
            <text x="310" y="295" text-anchor="middle" fill="white" font-family="sans-serif">API Gateway</text>
            
            <!-- Services -->
            <rect x="450" y="150" width="120" height="80" rx="8" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
            <text x="510" y="195" text-anchor="middle" fill="white" font-family="sans-serif">Service A</text>
            
            <rect x="450" y="350" width="120" height="80" rx="8" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
            <text x="510" y="395" text-anchor="middle" fill="white" font-family="sans-serif">Service B</text>
            
            <!-- Database -->
            <path d="M650 250 C 650 240, 770 240, 770 250 L 770 330 C 770 340, 650 340, 650 330 Z" fill="#1e293b" stroke="${primaryColor}" stroke-width="2"/>
            <path d="M650 250 C 650 260, 770 260, 770 250" fill="none" stroke="${primaryColor}" stroke-width="2"/>
            <text x="710" y="300" text-anchor="middle" fill="white" font-family="sans-serif">Database</text>
            
            <!-- Connections -->
            <line x1="170" y1="290" x2="240" y2="290" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)"/>
            <line x1="370" y1="290" x2="440" y2="190" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)"/>
            <line x1="370" y1="290" x2="440" y2="390" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)"/>
            <line x1="570" y1="190" x2="640" y2="290" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)"/>
            <line x1="570" y1="390" x2="640" y2="290" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)"/>
        </svg>`;
    }

    // Default Visualization (line-based to avoid bar charts)
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" style="background-color: #0f172a;">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.8" />
            </linearGradient>
        </defs>
        <text x="300" y="36" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="white" font-weight="bold">${title} Visualization</text>
        <rect x="40" y="60" width="520" height="300" rx="12" fill="#111827" stroke="#1f2937"/>
        <polyline points="60,330 140,260 200,280 260,210 340,250 420,190 500,220 540,180" fill="none" stroke="url(#grad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="330" r="4" fill="${primaryColor}" />
        <circle cx="140" cy="260" r="4" fill="${primaryColor}" />
        <circle cx="200" cy="280" r="4" fill="${primaryColor}" />
        <circle cx="260" cy="210" r="4" fill="${primaryColor}" />
        <circle cx="340" cy="250" r="4" fill="${primaryColor}" />
        <circle cx="420" cy="190" r="4" fill="${primaryColor}" />
        <circle cx="500" cy="220" r="4" fill="${primaryColor}" />
        <circle cx="540" cy="180" r="4" fill="${primaryColor}" />
        <line x1="60" y1="360" x2="560" y2="360" stroke="#1f2937" stroke-width="2" />
        <line x1="60" y1="360" x2="60" y2="80" stroke="#1f2937" stroke-width="2" />
    </svg>`;
};

const buildSystemPrompt = (title: string, description: string) => {
    return `${VISUAL_PROMPT_TEMPLATE}\n\nProject Title: ${title}\nProject Description: ${description}`;
};

const generateSVG = async (
    prompt: string,
    type: string,
    title: string,
    description: string,
): Promise<string> => {
    // Try to use Groq, but fallback immediately on error or if key is missing
    if (!process.env.GROQ_API_KEY) {
        return generateFallbackSVG(prompt, type, title);
    }

    const systemPrompt = buildSystemPrompt(title, description);

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: `Generate ONLY raw SVG for ${type}. Aspect ratio 16:9. Dark mode with neon accents. Avoid bar charts unless explicitly required. Use SaaS-style professional look. Context: ${prompt}`,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            max_tokens: 4096,
        });

        let content = completion.choices[0]?.message?.content || '';
        
        const svgMatch = content.match(/<svg[\s\S]*?<\/svg>/);
        if (svgMatch) {
            content = svgMatch[0];
        } else {
            const start = content.indexOf('<svg');
            const end = content.lastIndexOf('</svg>');
            if (start !== -1 && end !== -1) {
                content = content.substring(start, end + 6);
            } else {
                throw new Error('No SVG found in response');
            }
        }

        return content;
    } catch (error) {
        console.error(`Error generating SVG for ${title} (${type}):`, error);
        return generateFallbackSVG(prompt, type, title);
    }
};

export const generateProjectImages = async (project: IProject): Promise<VisualAsset[]> => {
    const slug = project.slug;
    const baseDir = path.join(process.cwd(), 'public', 'projects', slug);
    ensureDirectoryExists(baseDir);

    const visuals = project.visuals ?? [];
    const descriptionText = Array.isArray(project.description)
        ? project.description.join(' ')
        : project.description;
    const generated: VisualAsset[] = [];

    for (let i = 0; i < visuals.length; i++) {
        const visual = visuals[i];
        const fileName = `visual-${i + 1}.svg`;
        const promptContext = `${visual.prompt} | Project: ${project.title}. Description: ${descriptionText}`;

        console.log(`Generating ${visual.label} for ${project.title}...`);
        const svg = await generateSVG(promptContext, visual.label, project.title, descriptionText);
        fs.writeFileSync(path.join(baseDir, fileName), svg);

        generated.push({ ...visual, image: `/projects/${slug}/${fileName}` });
    }

    return generated;
};
