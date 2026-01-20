import React from "react";
import { getArchitectureDiagram } from '@/lib/architecture-diagrams';

interface Props {
	projectId: number;
	showVoiceButton?: boolean;
}

const SystemArchitectureDiagrams: React.FC<Props> = ({ projectId, showVoiceButton }) => {
	const diagram = getArchitectureDiagram(projectId);

	if (!diagram) {
		return <div className="p-4 text-gray-400 text-sm">No system architecture diagram available.</div>;
	}

	return (
		<div className="w-full overflow-x-auto custom-scrollbar">
			<pre className="font-mono text-[11px] sm:text-xs md:text-sm leading-[1.2] text-white whitespace-pre px-2 py-4">
				{diagram}
			</pre>
		</div>
	);
};

export default SystemArchitectureDiagrams;
