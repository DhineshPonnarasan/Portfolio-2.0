"use client";
import mermaid from "mermaid";
import { useEffect } from "react";

export default function Mermaid({ code }: { code: string }) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        background: "#000000",
        primaryColor: "#0a0a0a",
        primaryBorderColor: "#ffffff",
        primaryTextColor: "#ffffff",
        lineColor: "#ffffff",
        fontSize: "14px",
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: false,
        nodeSpacing: 50,
        rankSpacing: 50,
        curve: "basis",
      },
    });
    mermaid.run();
  }, [code]);

  return (
    <div
      className="mermaid"
      style={{
        background: "#000000",
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      {code}
    </div>
  );
}
