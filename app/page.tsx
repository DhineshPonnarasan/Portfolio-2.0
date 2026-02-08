import type { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import Banner from './_components/Banner';
import AboutMe from './_components/AboutMe';

// Dynamic imports for below-the-fold content to improve initial load performance
const Education = dynamic(() => import('./_components/Education'));
const Experiences = dynamic(() => import('./_components/Experiences'));
const Skills = dynamic(() => import('./_components/Skills'));
const ProjectList = dynamic(() => import('./_components/ProjectList'));
const Publications = dynamic(() => import('./_components/Publications'));
const OpenSource = dynamic(() => import('./_components/OpenSource'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    const sections = [
        { key: 'banner', node: <Banner /> },
        { key: 'about', node: <AboutMe /> },
        { key: 'education', node: <Education /> },
        { key: 'experience', node: <Experiences /> },
        { key: 'projects', node: <ProjectList /> },
        { key: 'skills', node: <Skills /> },
        { key: 'oss', node: <OpenSource /> },
        { key: 'publications', node: <Publications /> },
        { key: 'footer', node: <Footer /> },
    ];

    return (
        <div className="page-">
            {sections.map((section, index) => (
                <div
                    key={section.key}
                    data-animate="section"
                    className="animate-section-shell"
                    style={{ '--section-index': index } as CSSProperties}
                >
                    {section.node}
                </div>
            ))}
        </div>
    );
}
