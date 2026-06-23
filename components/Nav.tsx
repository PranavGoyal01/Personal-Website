"use client";

import { useState } from "react";
import { CATEGORY_COLORS, CATEGORY_LABELS, Category } from "./data/nodes";

interface NavProps {
  onAboutClick: () => void;
  showAbout: boolean;
}

const categories: Category[] = ["ai", "quant", "engineering", "leadership", "education"];

export default function Nav({ onAboutClick, showAbout }: NavProps) {
  const [legendOpen, setLegendOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 h-14"
      style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #111111" }}
    >
      <span
        className="text-sm font-semibold tracking-tight"
        style={{ color: "#ebebeb", letterSpacing: "-0.01em" }}
      >
        Pranav Goyal
      </span>

      <nav className="flex items-center gap-5">
        {/* Legend toggle */}
        <button
          onClick={() => setLegendOpen((o) => !o)}
          className="text-xs transition-colors duration-150"
          style={{ color: legendOpen ? "#ebebeb" : "#555" }}
        >
          Legend
        </button>

        <button
          onClick={onAboutClick}
          className="text-xs transition-colors duration-150"
          style={{ color: showAbout ? "#ebebeb" : "#555" }}
        >
          About
        </button>

        <a
          href="mailto:pranavgoyal0711@gmail.com"
          className="text-xs transition-colors duration-150"
          style={{ color: "#555" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ebebeb")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
        >
          Contact
        </a>

        <a
          href="https://www.linkedin.com/in/pranav-goyalcs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-colors duration-150"
          style={{ color: "#555" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ebebeb")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
        >
          LinkedIn
        </a>
      </nav>

      {/* Legend dropdown */}
      {legendOpen && (
        <div
          className="absolute top-14 right-6 py-3 px-4 rounded text-xs space-y-2 animate-fade-in"
          style={{ background: "#0e0e0e", border: "1px solid #1e1e1e", minWidth: 180 }}
        >
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
              <span style={{ color: "#888" }}>{CATEGORY_LABELS[cat]}</span>
            </div>
          ))}
          <div className="pt-1 mt-1" style={{ borderTop: "1px solid #1a1a1a", color: "#444" }}>
            Click any node to explore
          </div>
        </div>
      )}
    </header>
  );
}
