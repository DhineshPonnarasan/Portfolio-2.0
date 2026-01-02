import React, { useState } from "react";
import { getArchitectureDiagram } from '@/lib/architecture-diagrams';
import VoiceArchitectureExplanation from '../projects/VoiceArchitectureExplanation';
import { Mic } from 'lucide-react';

interface Props {
	projectId: number;
	showVoiceButton?: boolean;
}

const BORDER_CHARS = new Set([
	'|',
	'-',
	'+',
	'/',
	'\\',
	'_',
	'=',
	':',
	'.',
	"'",
	'`',
	'>',
	'<',
	'^',
	'v',
]);

const ARROW_CHARS = new Set(['|', '^', 'v']);

const createBorderLayer = (diagram: string) =>
	diagram
		.split('')
		.map((char) => {
			if (char === '\n') {
				return '\n';
			}
			return BORDER_CHARS.has(char) ? char : ' ';
		})
		.join('');

const createArrowLayer = (diagram: string) =>
	diagram
		.split('')
		.map((char) => {
			if (char === '\n') {
				return '\n';
			}
			return ARROW_CHARS.has(char) ? char : ' ';
		})
		.join('');

const SystemArchitectureDiagrams: React.FC<Props> = ({ projectId, showVoiceButton = false }) => {
	const diagram = getArchitectureDiagram(projectId);
	const [showVoicePanel, setShowVoicePanel] = useState(false);

	if (!diagram) {
		return null;
	}

	return (
		<div className="relative">
			<div className="ascii-architecture">
				<div className="ascii-flow-wrapper">
					<pre className="ascii-architecture__base">{diagram}</pre>
					<pre aria-hidden className="ascii-architecture__flow">{createBorderLayer(diagram)}</pre>
					<pre aria-hidden className="ascii-architecture__arrows">{createArrowLayer(diagram)}</pre>
				</div>
			</div>
			
			{showVoiceButton && (
				<>
					<button
						type="button"
						onClick={() => setShowVoicePanel(!showVoicePanel)}
						className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm text-white hover:border-primary/50 hover:text-primary transition-colors shadow-lg"
						aria-label="Toggle voice explanation"
					>
						<Mic size={16} />
						<span className="text-xs">Voice</span>
					</button>
					
					{showVoicePanel && (
						<div className="absolute top-16 right-0 z-20 w-full max-w-md">
							<VoiceArchitectureExplanation
								projectId={projectId}
								onClose={() => setShowVoicePanel(false)}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SystemArchitectureDiagrams;

