"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import DetailPanel from "@/components/DetailPanel";
import { GraphNode } from "@/components/data/nodes";

// Dynamically import Graph to avoid SSR issues with D3
const Graph = dynamic(() => import("@/components/Graph"), { ssr: false });

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleNodeClick = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
    if (node) setShowAbout(false);
  }, []);

  const handleAboutClick = useCallback(() => {
    setShowAbout((v) => !v);
    if (!showAbout) setSelectedNode(null);
  }, [showAbout]);

  return (
    <main className="w-screen h-screen relative overflow-hidden" style={{ background: "#080808" }}>
      <Nav onAboutClick={handleAboutClick} showAbout={showAbout} />

      {/* Full-viewport graph */}
      <div className="absolute inset-0 pt-14">
        <Graph onNodeClick={handleNodeClick} selectedId={selectedNode?.id ?? null} />
      </div>

      {/* Hint text — fades when something is selected */}
      {!selectedNode && !showAbout && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs pointer-events-none animate-fade-in"
          style={{ color: "#333", letterSpacing: "0.06em" }}
        >
          DRAG · CLICK TO EXPLORE
        </div>
      )}

      {/* About overlay */}
      {showAbout && (
        <div
          className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col animate-slide-in"
          style={{ background: "#0e0e0e", borderLeft: "1px solid #1e1e1e" }}
        >
          <div className="flex items-start justify-between p-6 pb-4" style={{ borderBottom: "1px solid #1a1a1a" }}>
            <div>
              <span className="text-xs uppercase tracking-widest font-medium mb-2 block" style={{ color: "#ebebeb", letterSpacing: "0.12em" }}>
                About
              </span>
              <h2 className="text-lg font-semibold" style={{ color: "#ebebeb" }}>Pranav Goyal</h2>
              <p className="text-sm mt-0.5" style={{ color: "#6b6b6b" }}>Hoboken, New Jersey</p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="ml-4 mt-1 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
              style={{ color: "#6b6b6b", background: "#1a1a1a" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ebebeb")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#6b6b6b")}
              aria-label="Close about"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <p className="text-sm leading-relaxed" style={{ color: "#aaaaaa" }}>
              I&apos;m a Computer Science student at Stevens Institute of Technology (Pinnacle Scholar) with minors in
              Quantitative Finance and Cybersecurity. I build backend and AI-enabled products with a focus on
              reliability, security, and measurable business impact.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#aaaaaa" }}>
              I&apos;m currently building DueForge and deepening production skills across APIs, cloud architecture, LLM
              application patterns, and secure system design. I also lead and collaborate in student engineering
              communities, translating ideas into shipped outcomes.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#aaaaaa" }}>
              I&apos;m actively seeking Software Engineering / Applied AI internships where I can contribute to real
              products end-to-end.
            </p>

            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1.25rem" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#444", letterSpacing: "0.1em" }}>
                Certifications
              </p>
              <ul className="space-y-1.5">
                {[
                  "AWS Certified Cloud Practitioner",
                  "AWS Certified AI Practitioner",
                  "AWS SAA-C03 (in progress)",
                  "AWS DVA-C02 (in progress)",
                ].map((cert) => (
                  <li key={cert} className="flex items-center gap-2 text-sm" style={{ color: "#888" }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#34d399" }} />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1.25rem" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#444", letterSpacing: "0.1em" }}>
                Honors
              </p>
              <ul className="space-y-1.5">
                {["Pinnacle Scholar — Stevens Institute of Technology", "Dean's List"].map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm" style={{ color: "#888" }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#a78bfa" }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1.25rem" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#444", letterSpacing: "0.1em" }}>
                Contact
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:pranavgoyal0711@gmail.com"
                  className="flex items-center gap-2 text-sm transition-colors duration-150"
                  style={{ color: "#888" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ebebeb")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#888")}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#60a5fa" }} />
                  pranavgoyal0711@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/pranav-goyalcs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm transition-colors duration-150"
                  style={{ color: "#888" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ebebeb")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#888")}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#60a5fa" }} />
                  linkedin.com/in/pranav-goyalcs
                </a>
              </div>
            </div>
          </div>

          <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #ebebeb22, transparent)" }} />
        </div>
      )}

      {/* Node detail panel */}
      <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </main>
  );
}
