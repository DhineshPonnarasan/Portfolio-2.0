'use client';
import TransitionLink from '@/components/TransitionLink';
import { IContribution } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowLeft, ExternalLink, Calendar, User, Code2, GitPullRequest, GitCommit, FileCode } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    contribution: IContribution;
}

gsap.registerPlugin(useGSAP);

const ContributionDetails = ({ contribution }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in', {
                autoAlpha: 0,
                y: 20,
            });

            const tl = gsap.timeline({ delay: 0.2 });

            tl.to('.fade-in', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-10 pb-20 min-h-screen">
            <div className="container max-w-4xl" ref={containerRef}>
                <div className="fade-in mb-10">
                    <TransitionLink
                        back
                        href="/"
                        className="inline-flex gap-2 items-center group h-12 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                        Back to Home
                    </TransitionLink>
                </div>

                <div className="fade-in mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                            {contribution.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-6 text-muted-foreground mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-5 text-primary" />
                            <span className="font-mono">{contribution.date}</span>
                        </div>
                        {contribution.role && (
                            <div className="flex items-center gap-2">
                                <User className="size-5 text-primary" />
                                <span className="font-medium">{contribution.role}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tech Stack & Stats Grid */}
                <div className="fade-in grid md:grid-cols-2 gap-8 mb-12">
                    {contribution.techStack && (
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Code2 className="size-5 text-primary" />
                                Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {contribution.techStack.map((tech, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-muted-foreground hover:text-white hover:border-primary/50 transition-colors"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {contribution.stats && (
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <GitPullRequest className="size-5 text-primary" />
                                Impact Metrics
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-primary mb-1">{contribution.stats.pullRequests}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">PRs</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-primary mb-1">{contribution.stats.commits}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Commits</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-primary mb-1">{contribution.stats.linesOfCode}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Lines</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="fade-in space-y-10">
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-primary mb-4">Overview</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {contribution.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-6">Key Contributions</h3>
                        <ul className="grid gap-4">
                            {contribution.points.map((point, idx) => (
                                <li 
                                    key={idx} 
                                    className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-primary/20 transition-colors"
                                >
                                    <span className="mt-1.5 size-2 rounded-full bg-primary shrink-0" />
                                    <span className="text-muted-foreground text-lg leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {contribution.link && (
                        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                            <a
                                href={contribution.link}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors text-lg"
                            >
                                View Repository
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ContributionDetails;
