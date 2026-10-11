export type Category =
  | "center"
  | "ai"
  | "quant"
  | "engineering"
  | "leadership"
  | "education";

export interface NodeDetail {
  links?: { label: string; href: string }[];
  role?: string;
  org?: string;
  dates?: string;
  bullets?: string[];
  tags?: string[];
}

export interface GraphNode {
  source?: "manual" | "linkedin";
  id: string;
  label: string;
  sublabel?: string;
  category: Category;
  detail: NodeDetail;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  center: "#ebebeb",
  ai: "#a78bfa",
  quant: "#34d399",
  engineering: "#60a5fa",
  leadership: "#fb923c",
  education: "#f9a8d4",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  center: "Identity",
  ai: "AI & Research",
  quant: "Quant Finance",
  engineering: "Engineering",
  leadership: "Leadership",
  education: "Education",
};

export interface PortfolioData {
  version: 1;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
import profile from "./profile.json";
export const nodes = profile.nodes as GraphNode[];
export const edges = profile.edges as GraphEdge[];
export const defaultProfile: PortfolioData = { version: 1, nodes, edges };
