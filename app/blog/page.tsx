import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Field notes on ML systems, MLOps, and shipping software at production scale.',
    alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogIndex() {
    const posts = await getAllPosts();
    return (
        <main className="pt-24 pb-16 min-h-screen">
            <div className="container mx-auto px-4">
                <section className="max-w-3xl mx-auto mb-12 space-y-4">
                    <p className="text-[0.7rem] tracking-[0.4em] uppercase text-muted-foreground/70">
                        /blog
                    </p>
                    <h1 className="text-3xl md:text-4xl font-anton bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Field notes
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                        Short posts on production ML, observability, and the
                        cost-of-good-ideas trade-offs in shipping software. RSS
                        available at <Link className="text-primary hover:underline" href="/feed.xml">/feed.xml</Link>.
                    </p>
                </section>

                <div className="max-w-3xl mx-auto space-y-6">
                    {posts.length === 0 && (
                        <p className="text-sm text-white/60">No posts yet — check back soon.</p>
                    )}
                    {posts.map((post) => (
                        <article
                            key={post.slug}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-primary/40 hover:bg-primary/[0.05]"
                        >
                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-xl md:text-2xl font-anton text-white hover:text-primary transition-colors"
                                >
                                    {post.title}
                                </Link>
                                <p className="text-sm text-white/75 leading-relaxed">{post.description}</p>
                                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-white/50">
                                    <span className="inline-flex items-center gap-2">
                                        <Calendar size={12} className="text-primary" />
                                        {post.date}
                                    </span>
                                    {post.tags.map((t) => (
                                        <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-primary/80">
                                            <Tag size={10} aria-hidden="true" /> {t}
                                        </span>
                                    ))}
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Read <ArrowUpRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
