
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PROJECTS } from '@/lib/data';
import { generateArchitectureExplanation } from '@/lib/architecture';

export async function GET() {
    try {
        const outputDir = path.join(process.cwd(), 'data', 'architecture');

        // Ensure directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const results = [];

        for (const project of PROJECTS) {
            try {
                const explanation = await generateArchitectureExplanation(project);
                const filePath = path.join(outputDir, `${project.slug}.md`);
                
                fs.writeFileSync(filePath, explanation, 'utf-8');
                
                results.push({
                    slug: project.slug,
                    status: 'success',
                    path: filePath
                });
            } catch (err) {
                console.error(`Failed to generate for ${project.slug}:`, err);
                results.push({
                    slug: project.slug,
                    status: 'error',
                    error: String(err)
                });
            }
        }

        return NextResponse.json({
            message: 'Architecture generation completed',
            results
        });
    } catch (error) {
        console.error('Error in architecture generation route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
