import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetails from '@/app/projects/[slug]/_components/ProjectDetails';
import { PROJECTS } from '@/lib/data';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { getCaseStudy } from '@/lib/case-studies';
import { buildProjectJsonLd } from '@/lib/jsonld';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const generateStaticParams = async () => {
    const { CASE_STUDIES } = await import('@/lib/case-studies');
    return CASE_STUDIES.map((c) => ({ slug: c.projectSlug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const project = PROJECTS.find((p) => p.slug === slug);
    const caseStudy = getCaseStudy(slug);
    if (!project || !caseStudy) return { title: 'Case study not found' };

    const pageUrl = `${SITE_URL}/case-studies/${slug}`;
    return {
        title: `Case study: ${project.title}`,
        description: caseStudy.summary,
        alternates: { canonical: pageUrl },
        openGraph: {
            type: 'article',
            url: pageUrl,
            title: `Case study · ${project.title} · ${SITE_NAME}`,
            description: caseStudy.summary,
            images: [{ url: `${SITE_URL}/projects/${slug}/ui.svg`, alt: project.title }],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const project = PROJECTS.find((p) => p.slug === slug);
    const caseStudy = getCaseStudy(slug);

    if (!project || !caseStudy) return notFound();

    const jsonLd = buildProjectJsonLd(project.slug);

    return (
        <section className="min-h-screen pt-12 pb-20">
            <div className="container mx-auto px-4 max-w-3xl mb-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-primary transition-colors"
                >
                    <ArrowLeft size={14} /> Home
                </Link>
                <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.4em] text-primary">
                    Case study
                </p>
                <h1 className="mt-2 text-3xl md:text-5xl font-anton leading-tight text-white">
                    {project.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-white/80">
                    {caseStudy.summary}
                </p>
                {caseStudy.heroMetric && (
                    <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3">
                        <span className="text-2xl font-anton text-primary">
                            {caseStudy.heroMetric.value}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-white/60">
                            {caseStudy.heroMetric.label}
                        </span>
                    </div>
                )}
            </div>

            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: jsonLd }}
                />
            )}

            <ProjectDetails project={project} />

            {caseStudy.callouts && caseStudy.callouts.length > 0 && (
                <div className="container mx-auto px-4 max-w-3xl mt-12 space-y-6">
                    {caseStudy.callouts.map((c) => (
                        <article
                            key={c.title}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                        >
                            <h2 className="text-xl font-anton text-primary">{c.title}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-white/80">{c.body}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Page;
