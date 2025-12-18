import { Groq } from 'groq-sdk';
import { PROJECTS } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Extract diagram SVG from HTML file
function extractDiagramFromHTML(projectSlug: string): string | null {
  try {
    const htmlPath = path.join(process.cwd(), 'public', 'portfolio_arch_diagrams.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Find the diagram ID based on project slug
    const projectIndex = PROJECTS.findIndex(p => p.slug === projectSlug);
    if (projectIndex === -1) {
      console.error(`Project not found for slug: ${projectSlug}`);
      return null;
    }

    const diagramId = `d${projectIndex + 1}`;
    console.log(`Looking for diagram ID: ${diagramId} for project: ${projectSlug}`);
    
    // Regex to match the entire <div class="diagram" id="dX">...</div> block, including SVG and legend
    const diagramRegex = new RegExp(`<div class=\\"diagram\\" id=\\"${diagramId}\\">([\\s\\S]*?)<\\/div>`, 'm');
    const match = htmlContent.match(diagramRegex);

    if (match) {
      // Return the full <div class="diagram" ...>...</div> block
      return `<div class=\"diagram\" id=\"${diagramId}\">${match[1]}</div>`;
    } else {
      console.error(`No diagram found matching pattern for ${diagramId}`);
      return null;
    }
  } catch (error) {
    console.error('Error reading HTML file:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { projectSlug } = await request.json();

    if (!projectSlug) {
      return NextResponse.json(
        { error: 'Project slug is required' },
        { status: 400 }
      );
    }

    // Find the project
    const project = PROJECTS.find(p => p.slug === projectSlug);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Extract existing diagram from HTML
    const existingDiagram = extractDiagramFromHTML(projectSlug);

    if (!existingDiagram) {
      return NextResponse.json(
        { error: 'Diagram not found in HTML file' },
        { status: 404 }
      );
    }

    // Only return the static diagram HTML, no AI
    return NextResponse.json(
      {
        projectTitle: project.title,
        diagramHtml: existingDiagram,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Enhance diagram error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
