"use client";
import { useEffect, useRef } from "react";
import { GraphNode, CATEGORY_COLORS, CATEGORY_LABELS } from "./data/nodes";
interface Props {
  node: GraphNode | null;
  onClose: () => void;
}
export default function DetailPanel({ node, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!node) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const items = Array.from(
          panel.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [],
        );
        const first = items[0],
          last = items[items.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panel.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === panel.current)
        ) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [node, onClose]);
  if (!node) return null;
  const color = CATEGORY_COLORS[node.category];
  return (
    <div className="panel-backdrop" onClick={onClose}>
      <div
        ref={panel}
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-top">
          <span className="eyebrow" style={{ color }}>
            {CATEGORY_LABELS[node.category]}
          </span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        </div>
        <h2 id="detail-title">{node.label}</h2>
        {node.detail.role && <p className="panel-role">{node.detail.role}</p>}
        {node.detail.org && <p className="muted">{node.detail.org}</p>}
        {node.detail.dates && <p className="dates">{node.detail.dates}</p>}
        <ul className="detail-bullets">
          {node.detail.bullets?.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="tags">
          {node.detail.tags?.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="detail-links">
          {node.detail.links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} →
            </a>
          ))}
        </div>
        {node.category === "center" && (
          <div className="detail-links">
            <a
              href="https://github.com/PranavGoyal01"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
            <a
              href="https://www.linkedin.com/in/pranav-goyal-cs"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn →
            </a>
          </div>
        )}
        <p className="panel-footer">Connected by curiosity.</p>
      </div>
    </div>
  );
}
