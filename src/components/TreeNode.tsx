"use client";

import { useState } from "react";
import { TreeNode as TreeNodeType, NodeType } from "@/types/tree";
import { isExpandable, pathToExpression } from "@/lib/treeUtils";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  onExpressionGenerated?: (expression: string) => void;
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

export default function TreeNode({ node, depth, onExpressionGenerated }: TreeNodeProps) {
  // Top-level nodes (depth 0) are expanded by default, others collapsed
  const [expanded, setExpanded] = useState(depth === 0);
  // Key to force remount of children when collapsing (resets their state)
  const [collapseKey, setCollapseKey] = useState(0);

  const expandable = isExpandable(node.type);
  const hasChildren = node.children && node.children.length > 0;

  // Handle arrow click - expand/collapse only
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (expanded) {
      // Collapsing: increment key to reset all children
      setCollapseKey((k) => k + 1);
    }
    setExpanded(!expanded);
  };

  // Handle label click - generate expression
  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpressionGenerated && node.path) {
      const expression = pathToExpression(node.path);
      onExpressionGenerated(expression);
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
      >
        {expandable && (
          <span
            className="tree-arrow"
            onClick={handleArrowClick}
            title="Click to expand/collapse"
          >
            {expanded ? "▼" : "►"}
          </span>
        )}
        <span
          className="tree-label-text"
          onClick={handleLabelClick}
          title={node.path ? `Click to insert {{ ${node.path} }}` : undefined}
        >
          {renderLabel()}
        </span>
      </span>

      {expandable && expanded && hasChildren && (
        <div className="tree-children">
          {node.children!.map((child, index) => (
            <TreeNode
              key={`${child.key}-${collapseKey}-${index}`}
              node={child}
              depth={depth + 1}
              onExpressionGenerated={onExpressionGenerated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
