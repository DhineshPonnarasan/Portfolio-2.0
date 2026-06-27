import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPost } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export const generateStaticParams = async () => {
    const posts = await getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: 'Post not found' };
    const pageUrl = `${SITE_URL}/blog/${post.slug}`;
    return {
        title: post.title,
        description: post.description,
        alternates: { canonical: pageUrl },
        openGraph: {
            type: 'article',
            url: pageUrl,
            title: post.title,
            description: post.description,
            publishedTime: post.date,
            authors: post.author ? [post.author] : undefined,
            tags: post.tags,
        },
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return notFound();

    return (
        <main className="pt-24 pb-16 min-h-screen">
            <article className="container mx-auto px-4 max-w-3xl">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-primary transition-colors"
                >
                    <ArrowLeft size={14} /> All posts
                </Link>
                <header className="mt-6 mb-10 space-y-3">
                    <h1 className="text-3xl md:text-5xl font-anton leading-tight text-white">
                        {post.title}
                    </h1>
                    <p className="text-base text-white/75">{post.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-white/50">
                        <span className="inline-flex items-center gap-2">
                            <Calendar size={12} className="text-primary" />
                            {post.date}
                        </span>
                        {post.author && <span>by {post.author}</span>}
                        {post.tags.map((t) => (
                            <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-primary/80">
                                <Tag size={10} aria-hidden="true" /> {t}
                            </span>
                        ))}
                    </div>
                </header>
                <div className="markdown-text prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.body}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    );
};

export default Page;
