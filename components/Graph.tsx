"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
  zoom,
  zoomIdentity,
  select,
} from "d3";
import type { Simulation, ZoomBehavior } from "d3";
import {
  GraphNode,
  CATEGORY_COLORS,
  nodes,
  edges,
  Category,
} from "./data/nodes";
import { NodeShape } from "./NodeShapes";
interface SimNode extends GraphNode {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
}
interface Link {
  source: SimNode;
  target: SimNode;
}
interface Props {
  onNodeClick: (node: GraphNode) => void;
  selectedId: string | null;
  category: Category | null;
}
const categories: Category[] = [
  "ai",
  "quant",
  "engineering",
  "leadership",
  "education",
];
export default function Graph({ onNodeClick, selectedId, category }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);
  const sim = useRef<Simulation<SimNode, Link> | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const drag = useRef<{
    id: string;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const [points, setPoints] = useState<SimNode[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  useEffect(() => {
    const graphNodes: SimNode[] = nodes.map((n) => {
      const branch = n.id.endsWith("-branch");
      const group = categories.indexOf(n.category);
      const leaves = nodes.filter(
        (a) => a.category === n.category && !a.id.endsWith("-branch"),
      );
      const leaf = leaves.findIndex((a) => a.id === n.id);
      const angle = (group * Math.PI * 2) / 5 - Math.PI / 2;
      const fan = branch ? 0 : (leaf - (leaves.length - 1) / 2) * 0.23;
      const r =
        n.category === "center" ? 0 : branch ? 170 : 310 + (leaf % 2) * 30;
      const homeX = 600 + Math.cos(angle + fan) * r * 1.38;
      const homeY = 430 + Math.sin(angle + fan) * r;
      return { ...n, x: homeX, y: homeY, homeX, homeY };
    });
    const byId = new Map(graphNodes.map((n) => [n.id, n]));
    const links: Link[] = edges.map((e) => ({
      source: byId.get(e.source)!,
      target: byId.get(e.target)!,
    }));
    const simulation = forceSimulation<SimNode>(graphNodes)
      .force(
        "link",
        forceLink<SimNode, Link>(links)
          .distance((l) => (l.source.category === "center" ? 180 : 150))
          .strength(0.08),
      )
      .force("charge", forceManyBody<SimNode>().strength(-140))
      .force(
        "collision",
        forceCollide<SimNode>((n) => (n.category === "center" ? 70 : 65)),
      )
      .force("x", forceX<SimNode>((n) => n.homeX).strength(0.18))
      .force("y", forceY<SimNode>((n) => n.homeY).strength(0.18))
      .on("tick", () => {
        graphNodes.forEach((n) => {
          n.x = Math.max(110, Math.min(1090, n.x));
          n.y = Math.max(75, Math.min(775, n.y));
        });
        setPoints(graphNodes.map((n) => ({ ...n })));
      });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      simulation.stop();
      simulation.tick(200);
      setPoints(graphNodes.map((n) => ({ ...n })));
    }
    sim.current = simulation;
    const svgEl = svg.current!;
    const behavior = zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [1200, 860],
      ])
      .scaleExtent([0.7, 2.5])
      .filter((e) => !e.target.closest?.("[data-node]") && !e.button)
      .on("zoom", (e) => {
        world.current?.setAttribute("transform", e.transform.toString());
      });
    select(svgEl).call(behavior).on("dblclick.zoom", null);
    zoomRef.current = behavior;
    return () => {
      simulation.stop();
      select(svgEl).on(".zoom", null);
    };
  }, []);
  const finishDrag = useCallback(() => {
    if (!drag.current) return;
    const n = sim.current?.nodes().find((n) => n.id === drag.current?.id);
    if (n) {
      n.fx = null;
      n.fy = null;
    }
    sim.current?.alphaTarget(0);
  }, []);
  const active = selectedId || hovered;
  const related = new Set([active]);
  edges.forEach((e) => {
    if (e.source === active) related.add(e.target);
    if (e.target === active) related.add(e.source);
  });
  const byId = new Map(points.map((n) => [n.id, n]));
  return (
    <div className="graph-container">
      <svg
        ref={svg}
        viewBox="0 0 1200 860"
        aria-label="Interactive portfolio graph. Tab to a node and press Enter to explore. Drag the background to pan."
        className="graph-svg"
      >
        <g ref={world}>
          <g aria-hidden="true">
            {edges.map((e) => {
              const a = byId.get(e.source),
                b = byId.get(e.target);
              if (!a || !b) return null;
              const emphasized =
                active && (e.source === active || e.target === active);
              return (
                <line
                  key={`${e.source}-${e.target}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={emphasized ? CATEGORY_COLORS[b.category] : "#39424c"}
                  strokeWidth={emphasized ? 1.8 : 1}
                  opacity={active && !emphasized ? 0.12 : 0.7}
                />
              );
            })}
          </g>
          {points.map((n) => {
            const center = n.category === "center",
              branch = n.id.endsWith("-branch");
            const dim = category
              ? n.category !== category && !center
              : !!active && !related.has(n.id);
            return (
              <g
                key={n.id}
                data-node={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}${n.sublabel ? `: ${n.sublabel}` : ""}`}
                aria-haspopup="dialog"
                transform={`translate(${n.x},${n.y})`}
                opacity={dim ? 0.2 : 1}
                className="graph-node"
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onNodeClick(n);
                  }
                }}
                onClick={() => {
                  if (!drag.current?.moved) onNodeClick(n);
                  drag.current = null;
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = {
                    id: n.id,
                    x: e.clientX,
                    y: e.clientY,
                    moved: false,
                  };
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (!d || d.id !== n.id) return;
                  if (
                    Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5 &&
                    !d.moved
                  )
                    return;
                  d.moved = true;
                  const matrix = world.current?.getScreenCTM();
                  if (!matrix) return;
                  const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
                    matrix.inverse(),
                  );
                  const target = sim.current
                    ?.nodes()
                    .find((a) => a.id === n.id);
                  if (target) {
                    target.fx = pt.x;
                    target.fy = pt.y;
                    sim.current?.alphaTarget(0.15).restart();
                  }
                }}
                onPointerUp={finishDrag}
                onPointerCancel={() => {
                  finishDrag();
                  drag.current = null;
                }}
                onLostPointerCapture={finishDrag}
              >
                <circle r={center ? 44 : 30} fill="transparent" />
                <NodeShape
                  category={n.category}
                  size={center ? 34 : branch ? 23 : 15}
                  hovered={hovered === n.id}
                  selected={selectedId === n.id}
                />
                {center && (
                  <text
                    y={5}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                    fontWeight={600}
                  >
                    PG
                  </text>
                )}
                <text
                  y={center ? 60 : branch ? 43 : 35}
                  textAnchor="middle"
                  fill={branch ? CATEGORY_COLORS[n.category] : "#e2e8ed"}
                  fontSize={center ? 18 : branch ? 15 : 14}
                  fontWeight={center || branch ? 600 : 400}
                >
                  {n.label.length > 22
                    ? n.label
                        .split(" ")
                        .reduce<string[]>((lines, word) => {
                          const last = lines.length - 1;
                          if (
                            last < 0 ||
                            (lines[last] + " " + word).length > 22
                          )
                            lines.push(word);
                          else lines[last] += " " + word;
                          return lines;
                        }, [])
                        .map((line, i) => (
                          <tspan key={line} x="0" dy={i ? 16 : 0}>
                            {line}
                          </tspan>
                        ))
                    : n.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="graph-controls" aria-label="Graph controls">
        <button
          aria-label="Zoom out"
          onClick={() => {
            if (svg.current && zoomRef.current)
              select(svg.current).call(zoomRef.current.scaleBy, 0.8);
          }}
        >
          −
        </button>
        <button
          onClick={() => {
            if (svg.current && zoomRef.current)
              select(svg.current).call(zoomRef.current.transform, zoomIdentity);
          }}
        >
          Reset view
        </button>
        <button
          aria-label="Zoom in"
          onClick={() => {
            if (svg.current && zoomRef.current)
              select(svg.current).call(zoomRef.current.scaleBy, 1.25);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
