import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            // AI crawlers — same rules; we don't try to noindex them explicitly.
            {
                userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}