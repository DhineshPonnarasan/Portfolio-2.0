"use client";
import React, { useRef, useEffect } from "react";

/**
 * CyberGridBackground: Animated neon cyberpunk grid using Canvas
 * - Neon cyan/purple grid, glowing intersections, subtle parallax, premium AI/SaaS look
 * - Sits behind content, auto-darkens for readability
 */
const CyberGridBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Neon colors
    const neonCyan = "#00fff7";
    const neonPurple = "#a020f0";
    const glowBlur = 12;
    const gridSize = 48;
    const intersectionRadius = 2.5;
    const intersectionGlow = 16;
    let mouseX = 0, mouseY = 0;

    // Parallax drift
    let t = 0;
    const animate = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      // Parallax tilt
      ctx.translate(mouseX * 0.04, mouseY * 0.04);
      // Subtle grid drift
      const offsetX = Math.sin(t) * 12;
      const offsetY = Math.cos(t * 0.7) * 8;
      // Draw grid lines
      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        ctx.save();
        ctx.shadowColor = neonCyan;
        ctx.shadowBlur = glowBlur;
        ctx.strokeStyle = neonCyan;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.restore();
      }
      for (let y = offsetY % gridSize; y < height; y += gridSize) {
        ctx.save();
        ctx.shadowColor = neonPurple;
        ctx.shadowBlur = glowBlur;
        ctx.strokeStyle = neonPurple;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.restore();
      }
      // Glowing intersections
      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        for (let y = offsetY % gridSize; y < height; y += gridSize) {
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.shadowColor = Math.random() > 0.5 ? neonCyan : neonPurple;
          ctx.shadowBlur = intersectionGlow;
          ctx.beginPath();
          ctx.arc(x, y, intersectionRadius, 0, 2 * Math.PI);
          ctx.fillStyle = Math.random() > 0.5 ? neonCyan : neonPurple;
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.restore();
      // Auto-darken behind content
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) / width * 32;
      mouseY = (e.clientY - height / 2) / height * 32;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none w-full h-full ${className || ""}`}
      style={{
        background: "#0a0a0f",
        opacity: 1,
        mixBlendMode: "screen",
        transition: "opacity 0.3s",
      }}
      aria-hidden="true"
    />
  );
};

export default CyberGridBackground;
