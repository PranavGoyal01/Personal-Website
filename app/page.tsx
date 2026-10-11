"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import DetailPanel from "@/components/DetailPanel";
import {
  GraphNode,
  nodes,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  Category,
} from "@/components/data/nodes";
const Graph = dynamic(() => import("@/components/Graph"), {
  ssr: false,
  loading: () => <p className="loading">Connecting the dots…</p>,
});
const categories: Category[] = [
  "ai",
  "quant",
  "engineering",
  "leadership",
  "education",
];
export default function Home() {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const open = useCallback((node: GraphNode) => setSelected(node), []);
  const close = useCallback(() => setSelected(null), []);
  const filtered = nodes.filter(
    (n) =>
      !n.id.endsWith("-branch") &&
      (!category || n.category === category) &&
      `${n.label} ${n.sublabel ?? ""} ${n.detail.tags?.join(" ") ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main>
      <Nav onIndexClick={() => setIndexOpen((v) => !v)} indexOpen={indexOpen} />
      <section className="intro">
        <div>
          <p className="eyebrow">Software · Research · Community</p>
          <h1>
            A few things.
            <br />
            <span>All connected.</span>
          </h1>
        </div>
        <div className="intro-copy">
          <p>
            I’m Pranav, a Computer Science student at Stevens. I build software,
            study markets, and bring people together.
          </p>
          <button className="text-button" onClick={() => open(nodes[0])}>
            A little more about me →
          </button>
        </div>
      </section>
      <section className="exploration" aria-label="Explore my work">
        <div className="explorer-bar">
          <span className="eyebrow">My constellation</span>
          <span className="muted">Select a node to follow a connection</span>
        </div>
        <div className="category-controls" aria-label="Filter by topic">
          <button aria-pressed={!category} onClick={() => setCategory(null)}>
            Everything
          </button>
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              <span style={{ background: CATEGORY_COLORS[c] }} />
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <div className={`explorer-body ${indexOpen ? "show-index" : ""}`}>
          <div className="graph-view">
            <Graph
              onNodeClick={open}
              selectedId={selected?.id ?? null}
              category={category}
            />
          </div>
          <aside
            id="portfolio-index"
            className="portfolio-index"
            aria-label="Portfolio index"
          >
            <label htmlFor="search">Find a connection</label>
            <input
              id="search"
              type="search"
              placeholder="Search work, roles, or skills"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="index-items">
              {filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => open(n)}
                  aria-haspopup="dialog"
                >
                  <span
                    className="index-dot"
                    style={{ background: CATEGORY_COLORS[n.category] }}
                  />
                  <span>
                    <strong>{n.label}</strong>
                    <small>{n.sublabel || CATEGORY_LABELS[n.category]}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
              {!filtered.length && (
                <p className="muted">
                  No connections found. Try another search.
                </p>
              )}
            </div>
          </aside>
        </div>
        <div className="explorer-footer">
          <span>Drag nodes · Pan the canvas · Scroll to zoom</span>
          <span>Stevens ’28 · Hoboken, NJ</span>
        </div>
      </section>
      <footer className="site-footer">
        <span>
          Pranav Goyal <span className="muted">/ Always building.</span>
        </span>
        <div>
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
      </footer>
      <DetailPanel node={selected} onClose={close} />
    </main>
  );
}
