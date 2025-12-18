import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface Props {
  mmdUrl: string;
}

const SystemDiagramMermaid: React.FC<Props> = ({ mmdUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(mmdUrl)
      .then((res) => res.text())
      .then((data) => {
        setCode(data);
        setLoading(false);
      });
  }, [mmdUrl]);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        background: "#000",
        primaryColor: "#000",
        primaryBorderColor: "#0ff",
        primaryTextColor: "#0ff",
        lineColor: "#0ff",
        fontSize: "16px",
      },
    });
    containerRef.current.innerHTML = `<div class='mermaid'>${code}</div>`;
    mermaid.run();
  }, [code]);

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

export default SystemDiagramMermaid;
