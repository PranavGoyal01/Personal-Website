"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { GraphNode, GraphEdge, CATEGORY_COLORS, nodes as nodeData, edges as edgeData } from "./data/nodes";
import { NodeShape } from "./NodeShapes";

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SimLink {
  source: SimNode;
  target: SimNode;
}

interface GraphProps {
  onNodeClick: (node: GraphNode | null) => void;
  selectedId: string | null;
}

function getNodeSize(node: GraphNode): number {
  if (node.category === "center") return 36;
  if (node.id.endsWith("-branch")) return 22;
  return 14;
}

export default function Graph({ onNodeClick, selectedId }: GraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simLinks, setSimLinks] = useState<SimLink[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({ width: parent.clientWidth, height: parent.clientHeight });
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Setup simulation
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const w = dimensions.width;
    const h = dimensions.height;

    const sns: SimNode[] = nodeData.map((n) => ({
      ...n,
      x: w / 2 + (Math.random() - 0.5) * 200,
      y: h / 2 + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
    }));

    const nodeById = new Map(sns.map((n) => [n.id, n]));

    const sls: SimLink[] = (edgeData as GraphEdge[])
      .map((e) => {
        const s = nodeById.get(e.source);
        const t = nodeById.get(e.target);
        if (!s || !t) return null;
        return { source: s, target: t };
      })
      .filter((l): l is SimLink => l !== null);

    const sim = d3
      .forceSimulation<SimNode>(sns)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(sls)
          .id((d) => d.id)
          .distance((l) => {
            const src = l.source as SimNode;
            const tgt = l.target as SimNode;
            if (src.category === "center" || tgt.category === "center") return 160;
            if (src.id.endsWith("-branch") || tgt.id.endsWith("-branch")) return 110;
            return 80;
          })
          .strength(0.6)
      )
      .force("charge", d3.forceManyBody<SimNode>().strength((d) => (d.category === "center" ? -800 : d.id.endsWith("-branch") ? -300 : -180)))
      .force("center", d3.forceCenter(w / 2, h / 2).strength(0.08))
      .force("collide", d3.forceCollide<SimNode>((d) => getNodeSize(d) + 18).strength(0.7))
      .alphaDecay(0.015)
      .on("tick", () => {
        setSimNodes([...sns]);
        setSimLinks([...sls]);
      });

    simulationRef.current = sim;

    // Drag behavior
    const svg = d3.select(svgRef.current);
    const nodeEls = svg.selectAll<SVGGElement, SimNode>("g.node-g");

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeEls.call(drag);

    return () => {
      sim.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  // Re-apply drag whenever simNodes re-render
  useEffect(() => {
    if (!simulationRef.current) return;
    const svg = d3.select(svgRef.current);
    const sim = simulationRef.current;
    const sns = sim.nodes();

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    svg
      .selectAll<SVGGElement, SimNode>("g.node-g")
      .data(sns, (d) => d.id)
      .call(drag);
  }, [simNodes]);

  const handleNodeClick = useCallback(
    (node: SimNode) => {
      if (selectedId === node.id) {
        onNodeClick(null);
      } else {
        onNodeClick(node);
      }
    },
    [onNodeClick, selectedId]
  );

  const isConnected = useCallback(
    (nodeId: string): boolean => {
      if (!selectedId && !hoveredId) return true;
      const activeId = selectedId || hoveredId;
      if (nodeId === activeId) return true;
      return simLinks.some(
        (l) =>
          (l.source.id === activeId && l.target.id === nodeId) ||
          (l.target.id === activeId && l.source.id === nodeId)
      );
    },
    [selectedId, hoveredId, simLinks]
  );

  if (!dimensions.width) {
    return <div className="w-full h-full" />;
  }

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ display: "block" }}
    >
      {/* Edge lines */}
      <g>
        {simLinks.map((link, i) => {
          const sx = link.source.x;
          const sy = link.source.y;
          const tx = link.target.x;
          const ty = link.target.y;
          const activeId = selectedId || hoveredId;
          const isActive =
            !activeId ||
            link.source.id === activeId ||
            link.target.id === activeId;
          const color =
            isActive
              ? CATEGORY_COLORS[link.source.category] + "55"
              : "#1a1a1a";

          return (
            <line
              key={i}
              x1={sx}
              y1={sy}
              x2={tx}
              y2={ty}
              stroke={color}
              strokeWidth={isActive ? 1.2 : 0.6}
              style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {simNodes.map((node) => {
          const size = getNodeSize(node);
          const hovered = hoveredId === node.id;
          const selected = selectedId === node.id;
          const color = CATEGORY_COLORS[node.category];
          const connected = isConnected(node.id);
          const dimmed = (!!selectedId || !!hoveredId) && !connected;

          const isBranch = node.id.endsWith("-branch");
          const isCenter = node.category === "center";

          return (
            <g
              key={node.id}
              className="node-g"
              transform={`translate(${node.x},${node.y})`}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                cursor: "pointer",
                opacity: dimmed ? 0.18 : 1,
                transition: "opacity 0.25s ease",
              }}
              data-id={node.id}
            >
              <NodeShape category={node.category} size={size} hovered={hovered} selected={selected} />

              {/* Label */}
              {isCenter ? (
                <>
                  <text
                    y={size + 16}
                    textAnchor="middle"
                    fill="#ebebeb"
                    fontSize={13}
                    fontWeight={600}
                    fontFamily="var(--font-inter), sans-serif"
                  >
                    {node.label}
                  </text>
                  {node.sublabel && (
                    <text
                      y={size + 30}
                      textAnchor="middle"
                      fill="#6b6b6b"
                      fontSize={9}
                      fontFamily="var(--font-inter), sans-serif"
                    >
                      {node.sublabel}
                    </text>
                  )}
                </>
              ) : isBranch ? (
                <text
                  y={size + 14}
                  textAnchor="middle"
                  fill={color}
                  fontSize={10}
                  fontWeight={500}
                  fontFamily="var(--font-inter), sans-serif"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {node.label}
                </text>
              ) : (
                <>
                  <text
                    y={size + 13}
                    textAnchor="middle"
                    fill={hovered || selected ? "#ebebeb" : "#888"}
                    fontSize={9}
                    fontWeight={hovered || selected ? 500 : 400}
                    fontFamily="var(--font-inter), sans-serif"
                    style={{ transition: "fill 0.15s ease" }}
                  >
                    {node.label}
                  </text>
                  {node.sublabel && (hovered || selected) && (
                    <text
                      y={size + 23}
                      textAnchor="middle"
                      fill="#555"
                      fontSize={8}
                      fontFamily="var(--font-inter), sans-serif"
                    >
                      {node.sublabel}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
