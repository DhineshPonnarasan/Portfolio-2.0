'use client';
import parse from 'html-react-parser';
import ArrowAnimation from '@/components/ArrowAnimation';
import TransitionLink from '@/components/TransitionLink';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
    project: IProject;
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ProjectDetails = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({
                delay: 0.5,
            });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
            });
        },
        { scope: containerRef },
    );

    // blur info div and make it smaller on scroll
    useGSAP(
        () => {
            if (window.innerWidth < 992) return;

            gsap.to('#info', {
                filter: 'blur(3px)',
                autoAlpha: 0,
                scale: 0.9,
                // position: 'sticky',
                scrollTrigger: {
                    trigger: '#info',
                    start: 'bottom bottom',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef },
    );

    // parallax effect on images
    useGSAP(
        () => {
            gsap.utils
                .toArray<HTMLDivElement>('#images > div')
                .forEach((imageDiv, i) => {
                    gsap.to(imageDiv, {
                        backgroundPosition: `center 0%`,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: imageDiv,
                            start: () => (i ? 'top bottom' : 'top 50%'),
                            end: 'bottom top',
                            scrub: true,
                            // invalidateOnRefresh: true, // to make it responsive
                        },
                    });
                });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-5 pb-14">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-16 inline-flex gap-2 items-center group h-12"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
                    Back
                </TransitionLink>

                <div
                    className="top-0 min-h-[calc(100svh-100px)] flex"
                    id="info"
                >
                    <div className="relative w-full">
                        <div className="flex items-start gap-6 mx-auto mb-10 max-w-[635px]">
                            <h1 className="fade-in-later opacity-0 text-4xl md:text-[60px] leading-none font-anton overflow-hidden">
                                <span className="inline-block">
                                    {project.title}
                                </span>
                            </h1>

                            <div className="fade-in-later opacity-0 flex gap-2">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <Github size={30} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <ExternalLink size={30} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-[635px] space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Year
                                </p>

                                <div className="text-lg">{project.year}</div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Tech & Technique
                                </p>

                                <div className="text-lg">
                                    {project.techStack.join(', ')}
                                </div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Description
                                </p>

                                <div className="text-lg prose-xl markdown-text mb-4">
                                    {parse(project.description)}
                                </div>
                                
                                {project.keyFeatures && project.keyFeatures.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-xl font-bold mb-3 text-primary">Key Features</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                            {project.keyFeatures.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {project.gallery && project.gallery.length > 0 && (
                                    <div className="mt-12 fade-in-later">
                                        <h3 className="text-xl font-bold mb-6 text-primary">Project Demo Gallery</h3>
                                        <motion.div 
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {project.gallery.map((img, idx) => (
                                                <motion.div 
                                                    key={idx} 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform border border-white/10 bg-zinc-900"
                                                >
                                                    <img 
                                                        src={img.src} 
                                                        alt={img.alt || project.title} 
                                                        className="w-full h-auto object-cover aspect-video" 
                                                    />
                                                    {img.alt && (
                                                        <p className="p-2 text-xs text-zinc-400 bg-zinc-950 text-center border-t border-white/5">
                                                            {img.alt}
                                                        </p>
                                                    )}
                                                </motion.div> 
                                            ))} 
                                        </motion.div>
                                    </div>
                                )}

                                {project.technicalHighlights && project.technicalHighlights.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-xl font-bold mb-3 text-primary">Technical Highlights</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                            {project.technicalHighlights.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {project.whatIBuilt && project.whatIBuilt.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-xl font-bold mb-3 text-primary">What I Built</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                            {project.whatIBuilt.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {project.skills && project.skills.length > 0 && (
                                <div className="fade-in-later">
                                    <p className="text-muted-foreground font-anton mb-3">
                                        Skills
                                    </p>

                                    <ul className="list-disc pl-5 space-y-2 text-lg text-muted-foreground/90">
                                        {project.skills.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <ArrowAnimation />
                    </div>
                </div>

                <div
                    className="fade-in-later relative flex flex-col gap-2 max-w-[800px] mx-auto"
                    id="images"
                >
                </div>
            </div>
        </section>
    );
};

export default ProjectDetails;
