/**
 * Hand-rolled blog post registry. Reads MDX/Markdown files from
 * `content/posts/*.mdx` at build time and exposes a typed list to pages
 * and the RSS feed. Avoids pulling in contentlayer/next-mdx-remote to
 * keep the dependency surface flat.
 */

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string; // ISO yyyy-mm-dd
    tags: string[];
    author?: string;
    body: string; // raw markdown
}

import fs from 'node:fs/promises';
import path from 'node:path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

const parseFrontMatter = (raw: string): { meta: Record<string, string>; body: string } => {
    const match = raw.match(FRONT_MATTER_RE);
    if (!match) return { meta: {}, body: raw };
    const [, metaRaw, body] = match;
    const meta: Record<string, string> = {};
    for (const line of metaRaw.split('\n')) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        meta[key] = value;
    }
    return { meta, body: body.trim() };
};

let cache: BlogPost[] | null = null;

export async function getAllPosts(): Promise<BlogPost[]> {
    if (cache) return cache;
    try {
        const files = await fs.readdir(POSTS_DIR);
        const posts: BlogPost[] = [];
        for (const file of files) {
            if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
            const slug = file.replace(/\.mdx?$/, '');
            const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8');
            const { meta, body } = parseFrontMatter(raw);
            posts.push({
                slug,
                title: meta.title ?? slug,
                description: meta.description ?? '',
                date: meta.date ?? '',
                tags: (meta.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
                author: meta.author,
                body,
            });
        }
        posts.sort((a, b) => (a.date < b.date ? 1 : -1));
        cache = posts;
        return posts;
    } catch {
        // No content dir yet — return empty list. The /blog page will still
        // render an empty-state.
        return [];
    }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    const all = await getAllPosts();
    return all.find((p) => p.slug === slug) ?? null;
}
