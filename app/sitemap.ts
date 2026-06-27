import type { MetadataRoute } from 'next';
import { PROJECTS, MY_CONTRIBUTIONS } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import { CASE_STUDIES } from '@/lib/case-studies';
import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date();

    // Static top-level routes. Only the ones that actually render a meaningful
    // page on their own are listed — anchor links on `/` aren't indexed.
    const topRoutes = ['', '/architecture', '/uses', '/blog', '/feed.xml'].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const projectRoutes = PROJECTS.map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const contributionRoutes = MY_CONTRIBUTIONS.map((contribution) => ({
        url: `${SITE_URL}/opensource/${contribution.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    const caseStudyRoutes = CASE_STUDIES.map((c) => ({
        url: `${SITE_URL}/case-studies/${c.projectSlug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts = await getAllPosts();
        blogRoutes = posts.map((post) => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: post.date ? new Date(post.date) : lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch {
        // Content dir unavailable at build — skip blog routes without throwing.
    }

    return [
        ...topRoutes,
        ...projectRoutes,
        ...contributionRoutes,
        ...caseStudyRoutes,
        ...blogRoutes,
    ];
}