"use client";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";

interface DiagramRendererProps {
  code: string;
  title?: string;
}

export default function DiagramRenderer({ code, title }: DiagramRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !code) return;
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        background: "#000",
        primaryColor: "#000",
        primaryBorderColor: "#fff",
        primaryTextColor: "#fff",
        lineColor: "#0ff",
        fontSize: "15px",
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: false,
        nodeSpacing: 60,
        rankSpacing: 60,
        curve: "basis",
      },
    });
    ref.current.innerHTML = `<div class='mermaid'>${code}</div>`;
    mermaid.run();
  }, [code]);

  return (
    <div style={{ background: "#000", borderRadius: 16, padding: 24, marginBottom: 32, overflowX: "auto" }}>
      {title && <h3 style={{ color: "#fff", marginBottom: 12 }}>{title}</h3>}
      <div ref={ref} />
    </div>
  );
}
