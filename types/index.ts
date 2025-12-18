export type Next_Page_Url = string;

export type Variant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
    | 'no-color';

export interface VisualAsset {
    label: string;
    prompt: string;
    image: string;
}

export interface IProject {
    id: number;
    title: string;
    year: number;
    description: string | string[];
    skills?: string[];
    techStack?: string[];
    techAndTechniques?: string[];
    metrics?: string[];
    interestingHighlights?: string[];
    thumbnail?: string;
    longThumbnail?: string;
    images?: string[];
    slug: string;
    liveUrl?: string;
    sourceCode?: string;
    points?: string[];
    keyFeatures?: string[];
    technicalHighlights?: string[];
    whatIBuilt?: string[];
    architecture?: string;
    gallery?: { src: string; alt?: string }[];
    visuals: VisualAsset[];
    architectureDiagram?: string;
    workflowDiagram?: string;
}

export interface IPublication {
    title: string;
    authors?: string;
    venue: string;
    year: string | number;
    link: string;
    abstract?: string;
    points: string[];
}

export interface IEducation {
    institution: string;
    location: string;
    degree: string;
    gpa?: string;
    duration: string;
    coursework?: string;
    achievements?: string;
}

export interface IContribution {
    title: string;
    slug: string;
    org: string;
    role: string;
    period: string;
    description: string;
    points: string[];
    deepDivePoints?: string[];
    link?: string;
    techStack?: string[];
    stats?: {
        pullRequests?: number;
        commits?: number;
        linesOfCode?: string;
    };
}
