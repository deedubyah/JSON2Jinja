"use client";

import { useState } from "react";
import { TreeNode as TreeNodeType, NodeType } from "@/types/tree";
import { isExpandable } from "@/lib/treeUtils";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  onNodeClick?: (path: string) => void;
}

function getValueClassName(type: NodeType): string {
  switch (type) {
    case NodeType.String:
      return "tree-value-string";
    case NodeType.Number:
      return "tree-value-number";
    case NodeType.Boolean:
      return "tree-value-boolean";
    case NodeType.Null:
      return "tree-value-null";
    default:
      return "";
  }
}

function formatValue(value: unknown, type: NodeType): string {
  if (type === NodeType.String) {
    const str = value as string;
    // Truncate URLs and long strings
    if (str.startsWith("http://") || str.startsWith("https://")) {
      return '"→URL←"';
    }
    if (str.length > 50) {
      return `"${str.slice(0, 47)}..."`;
    }
    return `"${str}"`;
  }
  if (type === NodeType.Null) {
    return "null";
  }
  return String(value);
}

export default function TreeNode({ node, depth, onNodeClick }: TreeNodeProps) {
  // Top-level nodes (depth 0) are expanded by default, others collapsed
  const [expanded, setExpanded] = useState(depth === 0);
  // Key to force remount of children when collapsing (resets their state)
  const [collapseKey, setCollapseKey] = useState(0);

  const expandable = isExpandable(node.type);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (expandable && hasChildren) {
      if (expanded) {
        // Collapsing: increment key to reset all children
        setCollapseKey((k) => k + 1);
      }
      setExpanded(!expanded);
    } else if (onNodeClick && node.path) {
      // Leaf node: trigger path insertion
      onNodeClick(node.path);
    }
  };

  const renderLabel = () => {
    if (expandable) {
      const typeLabel = node.type === NodeType.Array
        ? `[${node.children?.length || 0}]`
        : `{${node.children?.length || 0}}`;
      return (
        <>
          <span className="tree-key">{node.key}</span>
          <span className="tree-type-indicator">{typeLabel}</span>
        </>
      );
    }

    return (
      <>
        <span className="tree-key">{node.key}</span>
        <span className="tree-separator">: </span>
        <span className={getValueClassName(node.type)}>
          {formatValue(node.value, node.type)}
        </span>
      </>
    );
  };

  return (
    <div className="tree-node" style={{ marginLeft: depth > 0 ? 20 : 0 }}>
      <span
        className={`tree-label ${expandable ? "tree-expandable" : "tree-leaf"} ${expanded ? "expanded" : ""}`}
        onClick={handleClick}
      >
        {expandable && <span className="tree-arrow">{expanded ? "▼" : "►"}</span>}
        {renderLabel()}
      </span>

      {expandable && expanded && hasChildren && (
        <div className="tree-children">
          {node.children!.map((child, index) => (
            <TreeNode
              key={`${child.key}-${collapseKey}-${index}`}
              node={child}
              depth={depth + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
