import { getAllPosts } from '@/lib/blog';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

export const dynamic = 'force-static';

const escapeXml = (s: string) =>
    s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const rfc822 = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return new Date().toUTCString();
    return d.toUTCString();
};

/**
 * GET /feed.xml — RSS 2.0 feed of the blog posts. Cached at the edge via
 * `force-static` so the response is regenerated only when the underlying
 * `content/posts/*.mdx` files change.
 */
export async function GET() {
    const posts = await getAllPosts();
    const items = posts
        .map((p) => {
            const url = `${SITE_URL}/blog/${p.slug}`;
            return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${escapeXml(p.description)}</description>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

    return new Response(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
