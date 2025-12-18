import type { CSSProperties } from 'react';
import AboutMe from './_components/AboutMe';
import Banner from './_components/Banner';
import Education from './_components/Education';
import Experiences from './_components/Experiences';
import Skills from './_components/Skills';
import ProjectList from './_components/ProjectList';
import Publications from './_components/Publications';
import OpenSource from './_components/OpenSource';
import Footer from '@/components/Footer';

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
