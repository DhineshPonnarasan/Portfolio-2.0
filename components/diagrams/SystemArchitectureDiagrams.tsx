import React, { useMemo } from "react";
import { getArchitectureDiagram } from '@/lib/architecture-diagrams';
import { cn } from "@/lib/utils";

interface Props {
	projectId: number;
	showVoiceButton?: boolean;
}

const SystemArchitectureDiagrams: React.FC<Props> = ({ projectId, showVoiceButton }) => {
	const diagram = getArchitectureDiagram(projectId);

	const processedLines = useMemo(() => {
		if (!diagram) return null;

		return diagram.split('\n').map((line, idx) => {
			// Delay based on line index for "flowing" effect (Top -> Down)
			const delay = { animationDelay: `${idx * 0.15}s` };

			// 1. Horizontal Border Lines (e.g. "----------------", "+----------------+")
			if (/^\s*[+\-]{3,}\s*$/.test(line)) {
				return (
					<span key={idx} className="circuit-segment block text-primary/80" style={delay}>
						{line}
					</span>
				);
			}
			
			// 2. Vertical Arrows or Connectors (e.g. "     |     ", "     v     ", "   ---->   ")
			if (/^\s*[|v^]\s*$/.test(line) || /^\s*[<\->]{3,}\s*$/.test(line)) {
				return (
					<span key={idx} className="circuit-segment block text-primary font-bold" style={delay}>
						{line}
					</span>
				);
			}

			// 3. Box Content Rows with Borders (e.g. "| 1. DATA SOURCES ... |")
			// Matches: optional indent + pipe + content + pipe + optional trailing
			const boxMatch = line.match(/^(\s*)(\|)(.+)(\|)(\s*)$/);
			if (boxMatch) {
				const [_, indent, leftPipe, content, rightPipe, trailing] = boxMatch;
				return (
					<div key={idx} className="block text-muted-foreground">
						{indent}
						<span className="circuit-segment text-primary/80" style={delay}>{leftPipe}</span>
						<span className="text-white/90">{content}</span>
						<span className="circuit-segment text-primary/80" style={delay}>{rightPipe}</span>
						{trailing}
					</div>
				);
			}
			
			// 4. Fallback for other lines
			return <div key={idx} className="block text-muted-foreground">{line}</div>;
		});
	}, [diagram]);

	if (!diagram) {
		return <div className="p-4 text-gray-400 text-sm">No system architecture diagram available.</div>;
	}

	return (
		<div className="w-full overflow-x-auto custom-scrollbar select-none">
			<pre className="font-mono text-[10px] xs:text-[11px] sm:text-xs md:text-sm leading-[1.2] whitespace-pre px-4 py-6 bg-zinc-950/50 rounded-xl border border-white/5 shadow-inner">
				{processedLines}
			</pre>
		</div>
	);
};

export default SystemArchitectureDiagrams;
