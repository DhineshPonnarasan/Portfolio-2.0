
import fs from 'fs';
import path from 'path';
import { generateProjectImages } from '../lib/image-generator';
import { PROJECTS } from '../lib/data';

// Mock the alias if needed, or rely on ts-node checking tsconfig
// If this fails, we will fallback to a standalone script with data copied.

async function main() {
    console.log('Starting asset generation...');
    
    const updatedProjects = [];

    for (const project of PROJECTS) {
        console.log(`Processing ${project.title}...`);
        
        try {
            const gallery = await generateProjectImages(project);
            
            // Update project fields
            const newProject = {
                ...project,
                thumbnail: gallery[0].src, // Use UI screenshot as thumbnail
                longThumbnail: gallery[0].src,
                images: gallery.map(g => g.src),
                gallery: gallery
            };
            
            updatedProjects.push(newProject);
        } catch (err) {
            console.error(`Failed to process ${project.title}:`, err);
            updatedProjects.push(project); // Keep original if fail
        }
    }

    // Now we need to update lib/data.ts
    // We will read the file and replace the PROJECTS array
    const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
    let fileContent = fs.readFileSync(dataPath, 'utf-8');

    // Regex to find the PROJECTS array
    // This is tricky because of the complex object structure. 
    // Easier approach: We reconstruct the file content parts.
    // But we have other exports.
    
    // Alternative: We just output the new PROJECTS array to a file 'lib/projects-new.ts' 
    // and then manually or programmatically swap it.
    // Or we try to use a marker.
    
    // Let's look at the file structure again.
    // export const PROJECTS: IProject[] = [ ... ];
    
    const startMarker = 'export const PROJECTS: IProject[] = [';
    const endMarker = 'export const MY_CONTRIBUTIONS'; // The next export
    
    const startIndex = fileContent.indexOf(startMarker);
    const endIndex = fileContent.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
        console.error('Could not find PROJECTS block in lib/data.ts');
        return;
    }

    // We need to find the closing bracket of the array before MY_CONTRIBUTIONS
    // Searching backwards from endIndex
    const arrayEndIndex = fileContent.lastIndexOf('];', endIndex);
    
    if (arrayEndIndex === -1) {
        console.error('Could not find end of PROJECTS array');
        return;
    }

    const newProjectsString = JSON.stringify(updatedProjects, null, 4);
    // JSON.stringify keys are quoted, but TS object keys usually aren't. 
    // However, it's valid JS/TS.
    // We might want to remove quotes from keys to match style, but it's not strictly necessary.
    
    const newContent = 
        fileContent.substring(0, startIndex) + 
        `export const PROJECTS: IProject[] = ${newProjectsString};\n\n` + 
        fileContent.substring(endIndex);

    fs.writeFileSync(dataPath, newContent);
    console.log('Successfully updated lib/data.ts');
}

main().catch(console.error);
