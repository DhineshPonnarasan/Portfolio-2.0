import React, { useEffect, useRef, useState } from "react";
// @ts-expect-error d3-graphviz ships without type declarations
import { graphviz } from "d3-graphviz";

interface Props {
  dotUrl: string;
}

const SystemDiagramGraphviz: React.FC<Props> = ({ dotUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(dotUrl)
      .then((res) => res.text())
      .then((data) => {
        setDot(data);
        setLoading(false);
      });
  }, [dotUrl]);

  useEffect(() => {
    if (!dot || !containerRef.current) return;
    graphviz(containerRef.current)
      .zoom(false)
      .renderDot(dot)
      .on("end", () => {
        // Animate nodes/edges if needed
      });
  }, [dot]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[320px] bg-black rounded-xl p-4 overflow-auto border border-cyan-400 shadow-lg"
      style={{ color: "#0ff" }}
    >
      {loading && <div className="text-cyan-400 animate-pulse">Loading diagram...</div>}
    </div>
  );
};

export default SystemDiagramGraphviz;
