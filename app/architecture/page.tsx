import { PROJECTS } from '@/lib/data';
import ArchitectureExplorer from './_components/ArchitectureExplorer';

export default function ArchitecturePage() {
    const projects = PROJECTS.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        year: project.year,
        techAndTechniques: project.techAndTechniques,
        techStack: project.techStack,
    }));

    return (
        <main className="pt-24 pb-16 min-h-screen">
            <div className="container mx-auto px-4">
                <section className="max-w-4xl mx-auto mb-12 space-y-4">
                    <p className="text-[0.7rem] tracking-[0.4em] uppercase text-muted-foreground/70">
                        System Architecture
                    </p>
                    <h1 className="text-3xl md:text-4xl font-anton bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Architecture Playground
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                        Explore how each project behaves as a system. Generate multi-view architecture narratives,
                        compare flows, and see how the same engineer designs data, modeling, and deployment paths.
                    </p>
                </section>

                <ArchitectureExplorer projects={projects} />
            </div>
        </main>
    );
}


