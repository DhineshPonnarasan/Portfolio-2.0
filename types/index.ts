export type Next_Page_Url = string;
// UrlObject;
// | __next_route_internal_types__.StaticRoutes
// | __next_route_internal_types__.DynamicRoutes;

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

export interface IProject {
    title: string;
    year: number;
    description: string;
    skills?: string[];
    techStack: string[];
    thumbnail: string;
    longThumbnail: string;
    images: string[];
    slug: string;
    liveUrl?: string;
    sourceCode?: string;
    points?: string[];
    keyFeatures?: string[];
    technicalHighlights?: string[];
    whatIBuilt?: string[];
    architecture?: string;
    gallery?: { src: string; alt: string }[];
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
export interface IContribution {
    title: string;
    slug: string;
    role?: string;
    date: string;
    description: string;
    points: string[];
    link?: string;
    techStack?: string[];
    stats?: {
        pullRequests?: number;
        commits?: number;
        linesOfCode?: string;
    };
}   link?: string;
}
