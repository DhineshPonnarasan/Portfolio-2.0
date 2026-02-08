import type { MetadataRoute } from 'next';
import { PROJECTS, MY_CONTRIBUTIONS } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://me.toinfinite.dev';

    // Base routes
    const routes = [
        '',
        '/architecture',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1,
    }));

    // Project routes
    const projectRoutes = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Open Source Contribution routes
    const contributionRoutes = MY_CONTRIBUTIONS.map((contribution) => ({
        url: `${baseUrl}/opensource/${contribution.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...projectRoutes, ...contributionRoutes];
}
