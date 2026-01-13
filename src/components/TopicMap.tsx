"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProgressContext } from "@/components/ProgressProvider";
import ultimateData from "@/data/ultimateData";
import { countQuestionsInContent } from "@/utils/countUtils";

interface TopicNode {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  questionCount: number;
  completedCount: number;
  color: string;
  prerequisites: string[];
}

interface TopicEdge {
  from: string;
  to: string;
}

// Define topic relationships and positions
const topicRelationships: Record<
  string,
  { prereqs: string[]; color: string; shortName: string }
> = {
  basics: { prereqs: [], color: "#8b5cf6", shortName: "Basics" },
  sorting_techniques: {
    prereqs: ["basics"],
    color: "#ec4899",
    shortName: "Sorting",
  },
  arrays: { prereqs: ["basics"], color: "#3b82f6", shortName: "Arrays" },
  binary_search: {
    prereqs: ["arrays", "sorting_techniques"],
    color: "#f59e0b",
    shortName: "Binary Search",
  },
  strings: { prereqs: ["arrays"], color: "#10b981", shortName: "Strings" },
  linked_list: {
    prereqs: ["basics"],
    color: "#6366f1",
    shortName: "Linked List",
  },
  recursion: { prereqs: ["basics"], color: "#d946ef", shortName: "Recursion" },
  bit_manipulation: {
    prereqs: ["basics"],
    color: "#64748b",
    shortName: "Bit Manip",
  },
  stack_and_queues: {
    prereqs: ["arrays", "linked_list"],
    color: "#06b6d4",
    shortName: "Stack/Queue",
  },
  sliding_window: {
    prereqs: ["arrays"],
    color: "#84cc16",
    shortName: "Sliding Win",
  },
  heaps: {
    prereqs: ["arrays", "binary_trees"],
    color: "#eab308",
    shortName: "Heaps",
  },
  greedy_algorithms: {
    prereqs: ["arrays", "sorting_techniques"],
    color: "#f97316",
    shortName: "Greedy",
  },
  binary_trees: {
    prereqs: ["recursion", "linked_list"],
    color: "#22c55e",
    shortName: "Binary Trees",
  },
  binary_search_trees: {
    prereqs: ["binary_trees", "binary_search"],
    color: "#14b8a6",
    shortName: "BST",
  },
  graphs: {
    prereqs: ["recursion", "stack_and_queues"],
    color: "#a855f7",
    shortName: "Graphs",
  },
  dynamic_programming: {
    prereqs: ["recursion", "arrays"],
    color: "#ef4444",
    shortName: "DP",
  },
  tries: {
    prereqs: ["strings", "binary_trees"],
    color: "#0ea5e9",
    shortName: "Tries",
  },
};

// Calculate initial node positions in a directed graph layout
const calculateInitialPositions = (): Record<
  string,
  { x: number; y: number }
> => {
  const levels: Record<string, number> = {};

  // Calculate levels based on prerequisites
  const calculateLevel = (
    id: string,
    visited: Set<string> = new Set(),
  ): number => {
    if (visited.has(id)) return levels[id] || 0;
    visited.add(id);

    const prereqs = topicRelationships[id]?.prereqs || [];
    if (prereqs.length === 0) {
      levels[id] = 0;
      return 0;
    }

    const maxPrereqLevel = Math.max(
      ...prereqs.map((p) => calculateLevel(p, visited)),
    );
    levels[id] = maxPrereqLevel + 1;
    return levels[id];
  };

  Object.keys(topicRelationships).forEach((id) => calculateLevel(id));

  // Group by level
  const levelGroups: Record<number, string[]> = {};
  Object.entries(levels).forEach(([id, level]) => {
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(id);
  });

  // Position nodes with more spread
  const positions: Record<string, { x: number; y: number }> = {};
  const maxLevel = Math.max(...Object.values(levels));
  const width = 1200;
  const height = 700;
  const padding = 120;

  Object.entries(levelGroups).forEach(([levelStr, nodes]) => {
    const level = parseInt(levelStr);
    const y = padding + (level / maxLevel) * (height - 2 * padding);
    const xStep = (width - 2 * padding) / (nodes.length + 1);

    nodes.forEach((nodeId, index) => {
      positions[nodeId] = {
        x: padding + (index + 1) * xStep,
        y,
      };
    });
  });

  return positions;
};

const TopicMap: React.FC = () => {
  const router = useRouter();
  const { getCompletedCount } = useProgressContext();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >(() => calculateInitialPositions());
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStartPos = useRef<{
    x: number;
    y: number;
    nodeX: number;
    nodeY: number;
  } | null>(null);
  const hasDragged = useRef(false);

  const nodes: TopicNode[] = useMemo(() => {
    return ultimateData.data.content.map((topic) => {
      const id = topic.contentPath
        .replace(/^\//, "")
        .toLowerCase()
        .replace(/ /g, "_");
      const questionIds = topic.categoryList.flatMap((cat) =>
        cat.questionList.map((q) => q.questionId),
      );
      const completedCount = getCompletedCount(questionIds);
      const config = topicRelationships[id] || {
        prereqs: [],
        color: "#6366f1",
        shortName: topic.contentHeading,
      };

      return {
        id,
        name: topic.contentHeading,
        shortName: config.shortName,
        x: nodePositions[id]?.x || 600,
        y: nodePositions[id]?.y || 350,
        questionCount: countQuestionsInContent(topic),
        completedCount,
        color: config.color,
        prerequisites: config.prereqs,
      };
    });
  }, [getCompletedCount, nodePositions]);

  const edges: TopicEdge[] = useMemo(() => {
    const result: TopicEdge[] = [];
    nodes.forEach((node) => {
      node.prerequisites.forEach((prereq) => {
        if (nodes.some((n) => n.id === prereq)) {
          result.push({ from: prereq, to: node.id });
        }
      });
    });
    return result;
  }, [nodes]);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  const isRelated = (nodeId: string) => {
    if (!hoveredNode) return false;
    const hovered = getNodeById(hoveredNode);
    if (!hovered) return false;

    if (hovered.prerequisites.includes(nodeId)) return true;
    const node = getNodeById(nodeId);
    if (node?.prerequisites.includes(hoveredNode)) return true;

    return false;
  };

  // Convert screen coordinates to SVG coordinates
  const getSVGCoords = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgP = pt.matrixTransform(ctm.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  // Handle drag start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const coords = getSVGCoords(e.clientX, e.clientY);
      const node = nodePositions[nodeId];
      if (node) {
        dragStartPos.current = {
          x: coords.x,
          y: coords.y,
          nodeX: node.x,
          nodeY: node.y,
        };
        setDraggedNode(nodeId);
        hasDragged.current = false;
      }
    },
    [getSVGCoords, nodePositions],
  );

  // Handle drag move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedNode || !dragStartPos.current) return;

      const coords = getSVGCoords(e.clientX, e.clientY);
      const dx = coords.x - dragStartPos.current.x;
      const dy = coords.y - dragStartPos.current.y;

      // Only consider it a drag if moved more than 5 pixels
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged.current = true;
      }

      setNodePositions((prev) => ({
        ...prev,
        [draggedNode]: {
          x: Math.max(80, Math.min(1120, dragStartPos.current!.nodeX + dx)),
          y: Math.max(80, Math.min(620, dragStartPos.current!.nodeY + dy)),
        },
      }));
    },
    [draggedNode, getSVGCoords],
  );

  // Handle drag end / click
  const handleMouseUp = useCallback(
    (nodeId?: string) => {
      // If we didn't drag and we have a node, navigate to it
      if (!hasDragged.current && nodeId) {
        router.push(`/${nodeId}`);
      }
      setDraggedNode(null);
      dragStartPos.current = null;
    },
    [router],
  );

  // Global mouse up to handle release outside of node
  const handleGlobalMouseUp = useCallback(() => {
    setDraggedNode(null);
    dragStartPos.current = null;
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, nodeId: string) => {
      e.stopPropagation();
      const touch = e.touches[0];
      const coords = getSVGCoords(touch.clientX, touch.clientY);
      const node = nodePositions[nodeId];
      if (node) {
        dragStartPos.current = {
          x: coords.x,
          y: coords.y,
          nodeX: node.x,
          nodeY: node.y,
        };
        setDraggedNode(nodeId);
        hasDragged.current = false;
      }
    },
    [getSVGCoords, nodePositions],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!draggedNode || !dragStartPos.current) return;

      const touch = e.touches[0];
      const coords = getSVGCoords(touch.clientX, touch.clientY);
      const dx = coords.x - dragStartPos.current.x;
      const dy = coords.y - dragStartPos.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged.current = true;
      }

      setNodePositions((prev) => ({
        ...prev,
        [draggedNode]: {
          x: Math.max(80, Math.min(1120, dragStartPos.current!.nodeX + dx)),
          y: Math.max(80, Math.min(620, dragStartPos.current!.nodeY + dy)),
        },
      }));
    },
    [draggedNode, getSVGCoords],
  );

  const handleTouchEnd = useCallback(
    (nodeId?: string) => {
      if (!hasDragged.current && nodeId) {
        router.push(`/${nodeId}`);
      }
      setDraggedNode(null);
      dragStartPos.current = null;
    },
    [router],
  );

  // Node size - made bigger
  const NODE_RADIUS = 50;
  const BADGE_RADIUS = 16;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Topic Relationship Map
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag nodes to rearrange. Click to navigate.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span>Not Started</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox="0 0 1200 700"
          className="w-full min-w-[800px]"
          style={{
            height: "550px",
            cursor: draggedNode ? "grabbing" : "default",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleGlobalMouseUp}
          onMouseLeave={handleGlobalMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd()}
        >
          {/* Background grid */}
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-100 dark:text-gray-800"
              />
            </pattern>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Drop shadow for nodes */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges - render first so they're behind nodes */}
          {edges.map((edge, index) => {
            const fromNode = getNodeById(edge.from);
            const toNode = getNodeById(edge.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              hoveredNode === edge.from || hoveredNode === edge.to;

            // Calculate curve control point
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const curvature = 0.12;
            const ctrlX = midX - dy * curvature;
            const ctrlY = midY + dx * curvature;

            return (
              <g key={index}>
                <path
                  d={`M ${fromNode.x} ${fromNode.y} Q ${ctrlX} ${ctrlY} ${toNode.x} ${toNode.y}`}
                  fill="none"
                  stroke={isHighlighted ? fromNode.color : "currentColor"}
                  strokeWidth={isHighlighted ? 4 : 2}
                  strokeOpacity={isHighlighted ? 1 : 0.25}
                  className={
                    isHighlighted ? "" : "text-gray-300 dark:text-gray-600"
                  }
                />
                {isHighlighted && (
                  <path
                    d={`M ${fromNode.x} ${fromNode.y} Q ${ctrlX} ${ctrlY} ${toNode.x} ${toNode.y}`}
                    fill="none"
                    stroke={fromNode.color}
                    strokeWidth={4}
                    strokeOpacity={0.4}
                    filter="url(#glow)"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes - render in order so later nodes are on top */}
          {nodes.map((node) => {
            const progress =
              node.questionCount > 0
                ? (node.completedCount / node.questionCount) * 100
                : 0;
            const isHovered = hoveredNode === node.id;
            const isDragging = draggedNode === node.id;
            const related = isRelated(node.id);
            const dimmed = hoveredNode && !isHovered && !related && !isDragging;

            return (
              <g
                key={node.id}
                className="cursor-grab active:cursor-grabbing"
                style={{
                  opacity: dimmed ? 0.25 : 1,
                  transition: isDragging ? "none" : "opacity 0.2s",
                }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onMouseUp={() => handleMouseUp(node.id)}
                onMouseEnter={() => !draggedNode && setHoveredNode(node.id)}
                onMouseLeave={() => !draggedNode && setHoveredNode(null)}
                onTouchStart={(e) => handleTouchStart(e, node.id)}
                onTouchEnd={() => handleTouchEnd(node.id)}
              >
                {/* Outer glow on hover/drag */}
                {(isHovered || isDragging) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 15}
                    fill={node.color}
                    opacity={0.3}
                    filter="url(#glow)"
                  />
                )}

                {/* Background circle with shadow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill="white"
                  className="dark:fill-gray-900"
                  stroke={node.color}
                  strokeWidth={isDragging ? 6 : isHovered ? 5 : 3}
                  filter="url(#shadow)"
                />

                {/* Progress arc */}
                {progress > 0 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS - 8}
                    fill="none"
                    stroke={progress === 100 ? "#22c55e" : node.color}
                    strokeWidth={10}
                    strokeDasharray={`${(progress / 100) * 2 * Math.PI * (NODE_RADIUS - 8)} ${2 * Math.PI * (NODE_RADIUS - 8)}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${node.x} ${node.y})`}
                    opacity={0.8}
                  />
                )}

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[12px] font-bold fill-gray-700 dark:fill-gray-200 pointer-events-none select-none"
                >
                  {node.shortName}
                </text>

                {/* Question count badge */}
                <g
                  transform={`translate(${node.x + NODE_RADIUS - 12}, ${node.y - NODE_RADIUS + 12})`}
                >
                  <circle
                    r={BADGE_RADIUS}
                    fill={progress === 100 ? "#22c55e" : node.color}
                    stroke="white"
                    strokeWidth={3}
                    className="dark:stroke-gray-900"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[11px] font-bold fill-white pointer-events-none select-none"
                  >
                    {node.completedCount}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend / Selected node info */}
      {hoveredNode && !draggedNode && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          {(() => {
            const node = getNodeById(hoveredNode);
            if (!node) return null;
            const progress = Math.round(
              (node.completedCount / node.questionCount) * 100,
            );

            return (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {node.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {node.completedCount} / {node.questionCount} completed (
                    {progress}%)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {node.prerequisites.length > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Prerequisites:{" "}
                      {node.prerequisites
                        .map((p) => getNodeById(p)?.shortName)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Drag instruction hint */}
      {draggedNode && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Dragging {getNodeById(draggedNode)?.name}... Release to place.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicMap;
