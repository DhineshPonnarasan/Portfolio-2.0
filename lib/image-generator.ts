
import fs from 'fs';
import path from 'path';
import { Groq } from 'groq-sdk';
import { IProject } from '../types';

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

    // Default Visualization
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" style="background-color: #171717;">
        <text x="300" y="40" text-anchor="middle" font-family="sans-serif" font-size="20" fill="white">${title} Metrics</text>
        <rect x="50" y="60" width="500" height="300" fill="#262626"/>
        
        <!-- Bars -->
        <rect x="80" y="200" width="40" height="160" fill="${primaryColor}"/>
        <rect x="150" y="150" width="40" height="210" fill="${secondaryColor}"/>
        <rect x="220" y="100" width="40" height="260" fill="${primaryColor}"/>
        <rect x="290" y="180" width="40" height="180" fill="${secondaryColor}"/>
        <rect x="360" y="120" width="40" height="240" fill="${primaryColor}"/>
        <rect x="430" y="220" width="40" height="140" fill="${secondaryColor}"/>
        
        <!-- Axis -->
        <line x1="50" y1="360" x2="550" y2="360" stroke="#52525b" stroke-width="2"/>
        <line x1="50" y1="60" x2="50" y2="360" stroke="#52525b" stroke-width="2"/>
    </svg>`;
};

const generateSVG = async (prompt: string, type: string, title: string): Promise<string> => {
    // Try to use Groq, but fallback immediately on error or if key is missing
    if (!process.env.GROQ_API_KEY) {
        return generateFallbackSVG(prompt, type, title);
    }

    const systemPrompt = `
    You are an expert UI/UX Designer and Data Visualization Specialist.
    Your task is to generate high-quality, professional SVG code based on the user's description.
    
    RULES:
    1. Output ONLY the raw SVG code. No markdown, no explanation.
    2. The SVG must be responsive (viewBox="0 0 800 600" or similar) and scale well.
    3. Use modern color palettes (slate, zinc, indigo, blue, emerald).
    4. For UI Screenshots: Draw a browser window frame, sidebar, header, and main content area representing the app.
    5. For Architecture: Draw a clean, block-based system diagram with arrows and labels.
    6. For Visualizations: Draw professional charts (bar, line, heatmap, scatter) or data flow graphics.
    7. Text should be legible.
    8. Background should be transparent or have a subtle solid color fitting a dark/light mode aesthetic (prefer dark mode for tech portfolios).
    
    Ensure the SVG is valid and self-contained.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate an SVG for a ${type}. Title: ${title}. Context: ${prompt}` }
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

export const generateProjectImages = async (project: IProject) => {
    const slug = project.slug;
    const baseDir = path.join(process.cwd(), 'public', 'projects', slug);
    ensureDirectoryExists(baseDir);

    const images: { src: string; alt: string }[] = [];

    // 1. UI Screenshot
    console.log(`Generating UI for ${project.title}...`);
    const uiPrompt = `A modern SaaS dashboard UI for "${project.title}". Description: ${project.description}.`;
    const uiSvg = await generateSVG(uiPrompt, 'UI Screenshot', project.title);
    fs.writeFileSync(path.join(baseDir, 'ui.svg'), uiSvg);
    images.push({ src: `/projects/${slug}/ui.svg`, alt: `${project.title} - UI Dashboard` });

    // 2. Architecture Diagram
    console.log(`Generating Architecture for ${project.title}...`);
    const archPrompt = `A system architecture diagram for "${project.title}". Key Features: ${project.keyFeatures.join(', ')}.`;
    const archSvg = await generateSVG(archPrompt, 'System Architecture Diagram', project.title);
    fs.writeFileSync(path.join(baseDir, 'architecture.svg'), archSvg);
    images.push({ src: `/projects/${slug}/architecture.svg`, alt: `${project.title} - System Architecture` });

    // 3. Visualization 1
    console.log(`Generating Visualization 1 for ${project.title}...`);
    const vis1Prompt = `A data visualization or output chart for "${project.title}".`;
    const vis1Svg = await generateSVG(vis1Prompt, 'Data Visualization', project.title);
    fs.writeFileSync(path.join(baseDir, 'visualization-1.svg'), vis1Svg);
    images.push({ src: `/projects/${slug}/visualization-1.svg`, alt: `${project.title} - Visualization` });

    // 4. Visualization 2 (Optional)
    console.log(`Generating Visualization 2 for ${project.title}...`);
    const vis2Prompt = `Another distinct visual output for "${project.title}".`;
    const vis2Svg = await generateSVG(vis2Prompt, 'Metric Chart', project.title);
    fs.writeFileSync(path.join(baseDir, 'visualization-2.svg'), vis2Svg);
    images.push({ src: `/projects/${slug}/visualization-2.svg`, alt: `${project.title} - Metrics` });

    return images;
};
