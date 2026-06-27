import type { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Banner from './_components/Banner';
import AboutMe from './_components/AboutMe';
import { SectionFallback } from './_components/SectionFallback';
import SectionDivider from '@/components/SectionDivider';
import { buildPersonJsonLd } from '@/lib/jsonld';

// Dynamic imports for below-the-fold content to improve initial load performance.
// ssr: false here would be blocked by App Router rules — so we keep SSR on but
// still get chunk-splitting and lazy hydration for these heavier components.
const Education = dynamic(() => import('./_components/Education'));
const Experiences = dynamic(() => import('./_components/Experiences'));
const CareerTimeline = dynamic(() => import('./_components/CareerTimeline'));
const Skills = dynamic(() => import('./_components/Skills'));
const ProjectList = dynamic(() => import('./_components/ProjectList'));
const Publications = dynamic(() => import('./_components/Publications'));
const OpenSource = dynamic(() => import('./_components/OpenSource'));
const SocialProof = dynamic(() => import('./_components/SocialProof'));
const Talks = dynamic(() => import('./_components/Talks'));
const Awards = dynamic(() => import('./_components/Awards'));
const Footer = dynamic(() => import('@/components/Footer'));

// Pick a divider variant per gap so each transition feels unique.
const DIVIDER_VARIANTS = ['wave', 'tilt', 'chunks'] as const;

export default function Home() {
    const sections = [
        { key: 'banner', node: <Banner />, priority: true },
        { key: 'about', node: <AboutMe />, priority: true },
        { key: 'education', node: <Education /> },
        { key: 'experience', node: <Experiences /> },
        { key: 'timeline', node: <CareerTimeline /> },
        { key: 'projects', node: <ProjectList /> },
        { key: 'skills', node: <Skills /> },
        { key: 'oss', node: <OpenSource /> },
        { key: 'publications', node: <Publications /> },
        { key: 'social-proof', node: <SocialProof /> },
        { key: 'talks', node: <Talks /> },
        { key: 'awards', node: <Awards /> },
        { key: 'footer', node: <Footer /> },
    ];

    const jsonLd = buildPersonJsonLd();

    return (
        <div className="page-" id="main" tabIndex={-1}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd }}
            />
            {sections.map((section, index) => (
                <div key={`wrap-${section.key}`}>
                    <div
                        key={section.key}
                        data-animate="section"
                        data-section={section.key}
                        className="animate-section-shell"
                        style={{ '--section-index': index } as CSSProperties}
                    >
                        {section.priority ? (
                            section.node
                        ) : (
                            <Suspense fallback={<SectionFallback />}>
                                {section.node}
                            </Suspense>
                        )}
                    </div>
                    {/* Divider sits BETWEEN sections, never before the first
                        (the banner is the LCP; nothing should precede it). */}
                    {index < sections.length - 1 && (
                        <SectionDivider
                            variant={DIVIDER_VARIANTS[index % DIVIDER_VARIANTS.length]}
                            heightClass="h-12 md:h-20"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
