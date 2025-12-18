"use client";

import ProjectDetail from '@/components/projects/ProjectDetail';
import { IProject } from '@/types';

interface ProjectDetailsProps {
	project: IProject;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
	return <ProjectDetail project={project} />;
};

export default ProjectDetails;
