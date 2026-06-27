import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetails from './_components/ProjectDetails';
import { PROJECTS } from '@/lib/data';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { buildProjectJsonLd, buildBreadcrumbJsonLd } from '@/lib/jsonld';

export const generateStaticParams = async () => {
    return PROJECTS.map((project) => ({ slug: project.slug }));
};

const slugToOgImage = (slug: string) =>
    `${SITE_URL}/projects/${slug}/ui.svg`;

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const project = PROJECTS.find((p) => p.slug === slug);

    if (!project) {
        return {
            title: 'Project not found',
            robots: { index: false, follow: false },
        };
    }

    const techHighlights = project.techAndTechniques?.slice(0, 3).join(', ') ?? '';
    const descriptionText = Array.isArray(project.description)
        ? project.description[0]
        : project.description ?? '';

    const title = techHighlights
        ? `${project.title} — ${techHighlights}`
        : project.title;
    const pageUrl = `${SITE_URL}/projects/${project.slug}`;

    return {
        title,
        description: descriptionText,
        alternates: { canonical: pageUrl },
        openGraph: {
            type: 'article',
            url: pageUrl,
            title: `${project.title} · ${SITE_NAME}`,
            description: descriptionText,
            images: [{ url: slugToOgImage(project.slug), alt: project.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${project.title} · ${SITE_NAME}`,
            description: descriptionText,
            images: [slugToOgImage(project.slug)],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const project = PROJECTS.find((p) => p.slug === slug);

    if (!project) {
        return notFound();
    }

    const jsonLd = buildProjectJsonLd(project.slug);
    const pageUrl = `${SITE_URL}/projects/${project.slug}`;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: jsonLd }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: buildBreadcrumbJsonLd([
                        { name: 'Home', url: SITE_URL },
                        { name: 'Projects', url: `${SITE_URL}/#selected-projects` },
                        { name: project.title, url: pageUrl },
                    ]),
                }}
            />
            <ProjectDetails project={project} />
        </>
    );
};

export default Page;
