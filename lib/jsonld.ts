import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './site';
import { GENERAL_INFO, SOCIAL_LINKS, PROJECTS, MY_CONTRIBUTIONS, MY_EDUCATION } from './data';
import type { BlogPost } from './blog';

/**
 * Build a `BreadcrumbList` JSON-LD string from a sequence of `[name, url]`
 * pairs. The final entry should be the current page (no further links).
 */
export function buildBreadcrumbJsonLd(
    items: Array<{ name: string; url: string }>,
): string {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url,
        })),
    };
    return JSON.stringify(data);
}

/**
 * Build the canonical Person + WebSite JSON-LD pair used on the home page.
 * Kept dependency-free so it can be safely inlined into a server component.
 */
export function buildPersonJsonLd(): string {
    const sameAs = SOCIAL_LINKS.map((s) => s.url).filter(Boolean);

    const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Dhinesh Ponnarasan',
        url: SITE_URL,
        email: `mailto:${GENERAL_INFO.email}`,
        telephone: GENERAL_INFO.phone,
        sameAs,
        description: SITE_DESCRIPTION,
        jobTitle: 'AI/ML Engineer',
        knowsAbout: [
            'Machine Learning',
            'Artificial Intelligence',
            'Data Engineering',
            'Distributed Systems',
            'Next.js',
            'Python',
            'PyTorch',
            'TensorFlow',
        ],
        alumniOf: MY_EDUCATION.map((edu) => ({
            '@type': 'EducationalOrganization',
            name: edu.institution,
            address: edu.location,
        })),
        worksFor: [
            {
                '@type': 'Organization',
                name: 'Uplifty AI',
                address: 'Austin, Texas, United States',
            },
        ],
    };

    const website = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
    };

    // Use @graph so both objects share the dataset without conflicting @id roots.
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [person, website],
    };

    return JSON.stringify(graph);
}

/**
 * Build JSON-LD for a single project (CreativeWork / SoftwareSourceCode).
 */
export function buildProjectJsonLd(slug: string): string | null {
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) return null;

    const description = Array.isArray(project.description)
        ? project.description.join(' ')
        : project.description;

    const url = `${SITE_URL}/projects/${project.slug}`;
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project.title,
        url,
        description,
        dateCreated: `${project.year}-01-01`,
        dateModified: `${project.year}-12-31`,
        keywords: project.techStack?.join(', ') ?? project.techAndTechniques?.join(', '),
        author: {
            '@type': 'Person',
            name: 'Dhinesh Ponnarasan',
            url: SITE_URL,
        },
        image: `${url}/ui.svg`,
    };

    return JSON.stringify(data);
}

/**
 * Build JSON-LD for an open-source contribution entry.
 */
export function buildContributionJsonLd(slug: string): string | null {
    const c = MY_CONTRIBUTIONS.find((entry) => entry.slug === slug);
    if (!c) return null;

    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: c.title,
        url: `${SITE_URL}/opensource/${c.slug}`,
        description: c.description,
        dateCreated: `${c.period.split('–')[0]?.trim() ?? ''}-01-01`,
        author: {
            '@type': 'Person',
            name: 'Dhinesh Ponnarasan',
            url: SITE_URL,
        },
        contributor: {
            '@type': 'Organization',
            name: c.org,
            url: c.link,
        },
        keywords: c.techStack?.join(', '),
    };

    return JSON.stringify(data);
}

/**
 * Build JSON-LD for a blog post (`Article`).
 */
export function buildBlogPostJsonLd(post: BlogPost): string {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Person',
            name: post.author ?? 'Dhinesh Ponnarasan',
            url: SITE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        url,
        keywords: post.tags.join(', '),
        inLanguage: 'en',
    };
    return JSON.stringify(data);
}

/**
 * Build a `Course`-style JSON-LD for an education entry. Used on the home
 * page where the educational background is summarised in `Person.alumniOf`
 * and also as a standalone block if a dedicated education page is added later.
 */
export function buildCourseJsonLd(index: number): string | null {
    const edu = MY_EDUCATION[index];
    if (!edu) return null;

    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: edu.degree,
        description: edu.coursework ?? `${edu.degree} at ${edu.institution}`,
        provider: {
            '@type': 'EducationalOrganization',
            name: edu.institution,
            address: edu.location,
        },
        timeRequired: edu.duration,
        inLanguage: 'en',
    };
    return JSON.stringify(data);
}
