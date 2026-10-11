"use client";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import DetailPanel from "@/components/DetailPanel";
import {
  GraphNode,
  defaultProfile,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  Category,
} from "@/components/data/nodes";
import { validateProfile } from "@/lib/linkedin-import";
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
  const [profile, setProfile] = useState(defaultProfile);
  const [preview, setPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("preview") !== "1")
      return;
    try {
      const stored = localStorage.getItem("portfolio-preview-v1");
      if (!stored)
        throw new Error("Save a preview on the Update profile page first.");
      const value = JSON.parse(stored);
      validateProfile(value);
      setProfile(value);
      setPreview(true);
    } catch (e) {
      setPreviewError(
        e instanceof Error ? e.message : "Preview could not be loaded.",
      );
    }
  }, []);
  const open = useCallback((node: GraphNode) => setSelected(node), []);
  const close = useCallback(() => setSelected(null), []);
  const filtered = profile.nodes.filter(
    (n) =>
      !n.id.endsWith("-branch") &&
      (!category || n.category === category) &&
      `${n.label} ${n.sublabel || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="graph-page">
      <Nav
        onIndexClick={() => setIndexOpen((v) => !v)}
        indexOpen={indexOpen}
        onAboutClick={() =>
          open(profile.nodes.find((n) => n.category === "center")!)
        }
      />
      {preview && (
        <div className="preview-notice">
          Browser preview · Export and commit profile.json to publish.{" "}
          <a href="/">Exit preview</a>
        </div>
      )}
      {previewError && (
        <div className="preview-notice" role="alert">
          {previewError} <a href="/edit">Update profile</a>
        </div>
      )}
      <div className={`explorer-body ${indexOpen ? "show-index" : ""}`}>
        <div className="graph-view">
          <Graph
            nodes={profile.nodes}
            edges={profile.edges}
            onNodeClick={open}
            selectedId={selected?.id || null}
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
            placeholder="Search work or roles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="index-items">
            {filtered.map((n) => (
              <button key={n.id} onClick={() => open(n)} aria-haspopup="dialog">
                <span
                  className="index-dot"
                  style={{ background: CATEGORY_COLORS[n.category] }}
                />
                <span>
                  <strong>{n.label}</strong>
                  <small>{n.sublabel || CATEGORY_LABELS[n.category]}</small>
                </span>
              </button>
            ))}
            {!filtered.length && <p className="muted">No connections found.</p>}
          </div>
        </aside>
      </div>
      <footer className="graph-footer">
        <div className="category-controls" aria-label="Filter by topic">
          <button aria-pressed={!category} onClick={() => setCategory(null)}>
            All
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
        <p>Drag · Click to explore</p>
      </footer>
      <DetailPanel node={selected} onClose={close} />
    </main>
  );
}
