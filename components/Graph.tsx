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
  fx: number | null;
  fy: number | null;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simLinks, setSimLinks] = useState<SimLink[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const draggingIdRef = useRef<string | null>(null);

  // Measure container div (always mounted)
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Setup D3 simulation once dimensions are known
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
      fx: null,
      fy: null,
    }));

    simNodesRef.current = sns;

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
      .force(
        "charge",
        d3.forceManyBody<SimNode>().strength((d) =>
          d.category === "center" ? -800 : d.id.endsWith("-branch") ? -300 : -180
        )
      )
      .force("center", d3.forceCenter(w / 2, h / 2).strength(0.08))
      .force("collide", d3.forceCollide<SimNode>((d) => getNodeSize(d) + 18).strength(0.7))
      .alphaDecay(0.015)
      .on("tick", () => {
        setSimNodes([...sns]);
        setSimLinks([...sls]);
      });

    simulationRef.current = sim;

    return () => {
      sim.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  // Drag via React pointer events
  const getSVGPoint = useCallback(
    (e: React.PointerEvent<SVGElement>): { x: number; y: number } => {
      const svg = svgRef.current;
      if (!svg) return { x: e.clientX, y: e.clientY };
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      return { x: svgP.x, y: svgP.y };
    },
    []
  );

  const handleSVGPointerMove = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      const id = draggingIdRef.current;
      if (!id) return;
      const node = simNodesRef.current.find((n) => n.id === id);
      if (!node) return;
      const { x, y } = getSVGPoint(e);
      node.fx = x;
      node.fy = y;
      simulationRef.current?.alphaTarget(0.3).restart();
    },
    [getSVGPoint]
  );

  const handleSVGPointerUp = useCallback(() => {
    const id = draggingIdRef.current;
    if (!id) return;
    const node = simNodesRef.current.find((n) => n.id === id);
    if (node) {
      node.fx = null;
      node.fy = null;
    }
    simulationRef.current?.alphaTarget(0);
    draggingIdRef.current = null;
  }, []);

  const handleNodePointerDown = useCallback(
    (e: React.PointerEvent<SVGGElement>, node: SimNode) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingIdRef.current = node.id;
      node.fx = node.x;
      node.fy = node.y;
      simulationRef.current?.alphaTarget(0.3).restart();
    },
    []
  );

  const handleNodePointerMove = useCallback(
    (e: React.PointerEvent<SVGGElement>, node: SimNode) => {
      if (draggingIdRef.current !== node.id) return;
      e.stopPropagation();
      const { x, y } = getSVGPoint(e);
      node.fx = x;
      node.fy = y;
      simulationRef.current?.alphaTarget(0.3).restart();
    },
    [getSVGPoint]
  );

  const handleNodePointerUp = useCallback(
    (e: React.PointerEvent<SVGGElement>, node: SimNode) => {
      if (draggingIdRef.current !== node.id) return;
      node.fx = null;
      node.fy = null;
      simulationRef.current?.alphaTarget(0);
      draggingIdRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    []
  );

  const handleNodeClick = useCallback(
    (e: React.MouseEvent, node: SimNode) => {
      e.stopPropagation();
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
      const activeId = selectedId || hoveredId;
      if (!activeId) return true;
      if (nodeId === activeId) return true;
      return simLinks.some(
        (l) =>
          (l.source.id === activeId && l.target.id === nodeId) ||
          (l.target.id === activeId && l.source.id === nodeId)
      );
    },
    [selectedId, hoveredId, simLinks]
  );

  return (
    // Container div — always mounted so ResizeObserver can measure it
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        width={dimensions.width || "100%"}
        height={dimensions.height || "100%"}
        style={{ display: "block", touchAction: "none" }}
        onPointerMove={(e) => handleSVGPointerMove(e)}
        onPointerUp={handleSVGPointerUp}
        onPointerLeave={handleSVGPointerUp}
        onClick={() => onNodeClick(null)}
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
            const color = isActive
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
                style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease", pointerEvents: "none" }}
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
                transform={`translate(${node.x},${node.y})`}
                onClick={(e) => handleNodeClick(e, node)}
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                onPointerMove={(e) => handleNodePointerMove(e, node)}
                onPointerUp={(e) => handleNodePointerUp(e, node)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: draggingIdRef.current === node.id ? "grabbing" : "pointer",
                  opacity: dimmed ? 0.15 : 1,
                  transition: "opacity 0.25s ease",
                }}
              >
                <NodeShape
                  category={node.category}
                  size={size}
                  hovered={hovered}
                  selected={selected}
                />

                {isCenter ? (
                  <>
                    <text
                      y={size + 16}
                      textAnchor="middle"
                      fill="#ebebeb"
                      fontSize={13}
                      fontWeight={600}
                      fontFamily="var(--font-inter), sans-serif"
                      style={{ pointerEvents: "none", userSelect: "none" }}
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
                        style={{ pointerEvents: "none", userSelect: "none" }}
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
                    style={{ letterSpacing: "0.05em", pointerEvents: "none", userSelect: "none" }}
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
                      style={{ transition: "fill 0.15s ease", pointerEvents: "none", userSelect: "none" }}
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
                        style={{ pointerEvents: "none", userSelect: "none" }}
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
    </div>
  );
}
