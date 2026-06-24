"use client";

import { GraphNode, CATEGORY_COLORS, CATEGORY_LABELS } from "./data/nodes";

interface DetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export default function DetailPanel({ node, onClose }: DetailPanelProps) {
  if (!node) return null;

  const color = CATEGORY_COLORS[node.category];
  const categoryLabel = CATEGORY_LABELS[node.category];

  return (
    <div
      className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col animate-slide-in"
      style={{ background: "#0e0e0e", borderLeft: "1px solid #1e1e1e" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div>
          <span
            className="text-xs uppercase tracking-widest font-medium mb-2 block"
            style={{ color, letterSpacing: "0.12em" }}
          >
            {categoryLabel}
          </span>
          <h2 className="text-lg font-semibold leading-tight" style={{ color: "#ebebeb" }}>
            {node.label}
          </h2>
          {node.sublabel && (
            <p className="text-sm mt-0.5" style={{ color: "#6b6b6b" }}>
              {node.sublabel}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 mt-1 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150"
          style={{ color: "#6b6b6b", background: "#1a1a1a" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#ebebeb";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#6b6b6b";
          }}
          aria-label="Close panel"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {node.detail.role && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#444", letterSpacing: "0.1em" }}>
              Role
            </p>
            <p className="text-sm font-medium" style={{ color: "#ebebeb" }}>
              {node.detail.role}
            </p>
          </div>
        )}

        {node.detail.org && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#444", letterSpacing: "0.1em" }}>
              Organization
            </p>
            <p className="text-sm" style={{ color: "#aaaaaa" }}>
              {node.detail.org}
            </p>
          </div>
        )}

        {node.detail.dates && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#444", letterSpacing: "0.1em" }}>
              Period
            </p>
            <p className="text-sm" style={{ color: "#aaaaaa" }}>
              {node.detail.dates}
            </p>
          </div>
        )}

        {node.detail.bullets && node.detail.bullets.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#444", letterSpacing: "0.1em" }}>
              Details
            </p>
            <ul className="space-y-2">
              {node.detail.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: "#aaaaaa" }}>
                  <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: color }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {node.detail.tags && node.detail.tags.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#444", letterSpacing: "0.1em" }}>
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {node.detail.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accent line at bottom */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${color}44, transparent)` }} />
    </div>
  );
}
