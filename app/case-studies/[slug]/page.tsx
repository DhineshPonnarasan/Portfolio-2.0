import { notFound } from 'next/navigation';
import { PROJECTS } from '@/lib/data';

interface Params {
    slug: string;
}

export default function CaseStudyPage({ params }: { params: Params }) {
    const project = PROJECTS.find((p) => p.slug === params.slug);

    if (!project) {
        return notFound();
    }

    const description = Array.isArray(project.description) ? project.description : [project.description];

    return (
        <main className="pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl space-y-8">
                <header className="space-y-2">
                    <p className="text-[0.7rem] tracking-[0.4em] uppercase text-muted-foreground/70">
                        Architecture case study
                    </p>
                    <h1 className="text-3xl md:text-4xl font-anton">{project.title}</h1>
                    <p className="text-xs text-muted-foreground/80">Year: {project.year}</p>
                </header>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Problem & context</h2>
                    <p className="text-sm text-muted-foreground/90">
                        This case study restructures the existing project details into a narrative that surfaces the
                        problem, constraints, and architecture decisions. The underlying content is the same as in the
                        main Projects section.
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground/90 space-y-1">
                        {description.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                {project.metrics && project.metrics.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">Outcomes & impact</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground/90 space-y-1">
                            {project.metrics.map((m, index) => (
                                <li key={index}>{m}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {project.techAndTechniques && project.techAndTechniques.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">Tech & techniques in play</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground/90 space-y-1">
                            {project.techAndTechniques.map((tech, index) => (
                                <li key={index}>{tech}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">Key architectural features</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground/90 space-y-1">
                            {project.keyFeatures.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </main>
    );
}


