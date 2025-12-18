import React from "react";
import { getArchitectureDiagram } from '@/lib/architecture-diagrams';

interface Props {
	projectId: number;
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

const SystemArchitectureDiagrams: React.FC<Props> = ({ projectId }) => {
	const diagram = getArchitectureDiagram(projectId);

	if (!diagram) {
		return null;
	}

	return (
		<div className="ascii-architecture">
			<div className="ascii-flow-wrapper">
				<pre className="ascii-architecture__base">{diagram}</pre>
				<pre aria-hidden className="ascii-architecture__flow">{createBorderLayer(diagram)}</pre>
				<pre aria-hidden className="ascii-architecture__arrows">{createArrowLayer(diagram)}</pre>
			</div>
		</div>
	);
};

export default SystemArchitectureDiagrams;

