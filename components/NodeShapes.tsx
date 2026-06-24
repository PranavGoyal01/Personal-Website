"use client";

import { Category, CATEGORY_COLORS } from "./data/nodes";

interface ShapeProps {
  category: Category;
  size: number;
  hovered: boolean;
  selected: boolean;
}

function hexPath(r: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

function diamondPath(r: number): string {
  return `M 0,${-r} L ${r},0 L 0,${r} L ${-r},0 Z`;
}

function squarePath(r: number): string {
  const s = r * 0.88;
  return `M ${-s},${-s} L ${s},${-s} L ${s},${s} L ${-s},${s} Z`;
}

function starPath(r: number): string {
  const outer = r;
  const inner = r * 0.45;
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? outer : inner;
    return `${rad * Math.cos(angle)},${rad * Math.sin(angle)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

export function NodeShape({ category, size, hovered, selected }: ShapeProps) {
  const color = CATEGORY_COLORS[category];
  const opacity = selected ? 1 : hovered ? 0.9 : 0.75;
  const strokeWidth = selected ? 2 : hovered ? 1.5 : 1;
  const strokeColor = selected ? color : hovered ? color : "#333333";
  const fill = category === "center" ? "#1a1a1a" : "#0e0e0e";
  const glowFilter = selected || hovered ? `drop-shadow(0 0 8px ${color}55)` : undefined;

  const sharedProps = {
    fill,
    stroke: strokeColor,
    strokeWidth,
    style: { filter: glowFilter, opacity, transition: "all 0.2s ease" },
  };

  switch (category) {
    case "center":
      return (
        <circle
          r={size}
          fill="#141414"
          stroke={color}
          strokeWidth={selected ? 2.5 : 1.5}
          style={{ filter: `drop-shadow(0 0 12px ${color}66)`, opacity, transition: "all 0.2s ease" }}
        />
      );
    case "ai":
      return <path d={hexPath(size)} {...sharedProps} />;
    case "quant":
      return <path d={diamondPath(size)} {...sharedProps} />;
    case "engineering":
      return <path d={squarePath(size)} {...sharedProps} />;
    case "leadership":
      return <path d={starPath(size)} {...sharedProps} />;
    case "education":
      return (
        <circle
          r={size}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          style={{ filter: glowFilter, opacity, transition: "all 0.2s ease" }}
        />
      );
    default:
      return <circle r={size} {...sharedProps} />;
  }
}
