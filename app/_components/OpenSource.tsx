'use client';
import TransitionLink from '@/components/TransitionLink';
import { MY_CONTRIBUTIONS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef, useState } from 'react';
import { GitPullRequest, ArrowUpRight, GitCommit, FileCode, Star } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OpenSource = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom bottom',
                    scrub: 1,
                },
            });

            tl.fromTo(
                '.os-card',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="py-20" id="open-source" ref={containerRef}>
            <div className="container">
                <SectionTitle title="Open Source Contributions" />
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MY_CONTRIBUTIONS.map((contribution, idx) => (
                        <TransitionLink
                            key={idx}
                            href={`/opensource/${contribution.slug}`}
                            className="os-card group relative h-full"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="h-full flex flex-col p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-xl bg-white/5 text-white group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                        <GitPullRequest size={24} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground/60 border border-white/5 px-2 py-1 rounded-full">
                                        <span>{contribution.date.split('(')[0].trim()}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-8 flex-grow">
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                                        {contribution.title}
                                    </h3>
                                    {contribution.role && (
                                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">
                                            {contribution.role}
                                        </span>
                                    )}
                                    <p className="text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-muted-foreground/80 transition-colors">
                                        {contribution.description}
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-anton text-white">
                                            {contribution.stats?.pullRequests || 0}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                            PRs Merged
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-anton text-white">
                                            {contribution.stats?.commits || 0}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                            Commits
                                        </span>
                                    </div>
                                </div>

                                {/* Footer / Action */}
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex -space-x-2">
                                        {contribution.techStack?.slice(0, 3).map((tech, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-900 flex items-center justify-center text-[10px] text-white/50 ring-2 ring-black">
                                                {tech[0]}
                                            </div>
                                        ))}
                                        {contribution.techStack && contribution.techStack.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-900 flex items-center justify-center text-[10px] text-white/50 ring-2 ring-black">
                                                +{contribution.techStack.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        View Project <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </TransitionLink>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OpenSource;
