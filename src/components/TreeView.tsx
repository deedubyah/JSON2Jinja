"use client";

import { useMemo } from "react";
import { jsonToTree } from "@/lib/treeUtils";
import { TreeNode as TreeNodeType, NodeType } from "@/types/tree";
import TreeNode from "./TreeNode";

interface TreeViewProps {
  data: unknown;
  onNodeClick?: (path: string) => void;
}

export default function TreeView({ data, onNodeClick }: TreeViewProps) {
  const tree = useMemo(() => {
    if (data === null || data === undefined) {
      return null;
    }
    return jsonToTree(data);
  }, [data]);

  if (!tree) {
    return null;
  }

  // If root is an object or array, render its children directly
  // Otherwise render the single value
  if (tree.type === NodeType.Object || tree.type === NodeType.Array) {
    if (!tree.children || tree.children.length === 0) {
      return (
        <div className="tree-empty text-foreground-muted text-sm italic">
          Empty {tree.type === NodeType.Array ? "array" : "object"}
        </div>
      );
    }

    return (
      <div className="tree-view">
        {tree.children.map((child: TreeNodeType, index: number) => (
          <TreeNode
            key={`${child.key}-${index}`}
            node={child}
            depth={0}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    );
  }

  // Single primitive value at root
  return (
    <div className="tree-view">
      <TreeNode node={tree} depth={0} onNodeClick={onNodeClick} />
    </div>
  );
}
