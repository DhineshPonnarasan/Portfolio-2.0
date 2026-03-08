import { VisualAsset } from '@/types';

interface Props {
    visuals?: VisualAsset[];
}

const ProjectDemoGallery = ({ visuals }: Props) => {
    if (!visuals || visuals.length === 0) return null;

    return null;
};

export default ProjectDemoGallery;
