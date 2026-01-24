import TransitionLink from '@/components/TransitionLink';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

interface Props {
    index: number;
    project: IProject;
    selectedProject: string | null;
    onMouseEnter: (_slug: string) => void;
    onMouseLeave?: () => void;
}

gsap.registerPlugin(useGSAP);

const Project = ({ index, project, selectedProject, onMouseEnter, onMouseLeave }: Props) => {
    const externalLinkSVGRef = useRef<SVGSVGElement>(null);

    const { context, contextSafe } = useGSAP(() => {}, {
        scope: externalLinkSVGRef,
        revertOnUpdate: true,
    });

    const handleMouseEnter = contextSafe?.(() => {
        onMouseEnter(project.slug);

        const arrowLine = externalLinkSVGRef.current?.querySelector(
            '#arrow-line',
        ) as SVGPathElement;
        const arrowCurb = externalLinkSVGRef.current?.querySelector(
            '#arrow-curb',
        ) as SVGPathElement;
        const box = externalLinkSVGRef.current?.querySelector(
            '#box',
        ) as SVGPathElement;

        gsap.set(box, {
            opacity: 0,
            strokeDasharray: box?.getTotalLength(),
            strokeDashoffset: box?.getTotalLength(),
        });
        gsap.set(arrowLine, {
            opacity: 0,
            strokeDasharray: arrowLine?.getTotalLength(),
            strokeDashoffset: arrowLine?.getTotalLength(),
        });
        gsap.set(arrowCurb, {
            opacity: 0,
            strokeDasharray: arrowCurb?.getTotalLength(),
            strokeDashoffset: arrowCurb?.getTotalLength(),
        });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tl.to(externalLinkSVGRef.current, {
            autoAlpha: 1,
        })
            .to(box, {
                opacity: 1,
                strokeDashoffset: 0,
            })
            .to(
                arrowLine,
                {
                    opacity: 1,
                    strokeDashoffset: 0,
                },
                '<0.2',
            )
            .to(arrowCurb, {
                opacity: 1,
                strokeDashoffset: 0,
            })
            .to(
                externalLinkSVGRef.current,
                {
                    autoAlpha: 0,
                },
                '+=1',
            );
    });

    const handleMouseLeave = contextSafe?.(() => {
        context.kill();
        if (onMouseLeave) onMouseLeave();
    });

    return (
        <TransitionLink
            href={`/projects/${project.slug}`}
            className="project-item group leading-none py-12 md:py-5 border-b border-white/10 md:border-transparent md:border-b first:pt-0 last:pb-0 last:border-none md:group-hover/projects:opacity-30 md:hover:!opacity-100 transition-all"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex gap-2 md:gap-5">
                <div className="font-anton text-muted-foreground text-lg md:text-base pt-1 md:pt-0">
                    _{(index + 1).toString().padStart(2, '0')}.
                </div>
                <div className="w-full">
                    <h4 className="text-3xl xs:text-4xl md:text-6xl flex flex-wrap gap-2 md:gap-4 font-anton transition-all duration-700 bg-gradient-to-r from-primary to-foreground from-[50%] to-[50%] bg-[length:200%] bg-right bg-clip-text text-transparent group-hover:bg-left leading-tight md:leading-none">
                        {project.title}
                        <span className="text-foreground opacity-0 group-hover:opacity-100 transition-all hidden md:inline-block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                ref={externalLinkSVGRef}
                            >
                                <path
                                    id="box"
                                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                ></path>
                                <path id="arrow-line" d="M10 14 21 3"></path>
                                <path id="arrow-curb" d="M15 3h6v6"></path>
                            </svg>
                        </span>
                    </h4>

                    {/* Mobile Project Preview */}
                    <div className="md:hidden relative w-full aspect-video my-6 rounded-lg overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                        <Image
                            src={`/projects/${project.slug}/ui.svg`}
                            alt={project.title}
                            fill
                            className="object-contain p-4"
                        />
                    </div>

                    <p className="text-muted-foreground my-4 text-sm md:text-base max-w-3xl leading-relaxed line-clamp-3 md:line-clamp-none">
                        {Array.isArray(project.description)
                            ? project.description[0]
                            : project.description}
                    </p>
                    <div className="mt-4 md:mt-2 flex flex-wrap gap-2 md:gap-3 text-muted-foreground text-xs font-mono uppercase tracking-wider">
                        {(project.techAndTechniques ?? []).slice(0, 4).map((tech, idx, stackArr) => (
                            <div className="gap-2 md:gap-3 flex items-center" key={tech}>
                                <span className="">{tech.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()}</span>
                                {idx !== Math.min(stackArr.length, 4) - 1 && (
                                    <span className="inline-block size-1 rounded-full bg-white/20"></span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TransitionLink>
    );
};

export default Project;
