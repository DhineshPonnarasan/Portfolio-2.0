import { VisualAsset } from '@/types';

interface Props {
    visuals?: VisualAsset[];
}

const ProjectDemoGallery = ({ visuals }: Props) => {
    if (!visuals || visuals.length === 0) return null;

    // Convert VisualAsset[] to the format SystemOutput expects
    const imagePrompts = visuals.map(v => ({
        label: v.label,
        prompt: v.prompt,
    }));

    return null;
};

export default ProjectDemoGallery;
