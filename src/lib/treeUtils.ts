import { NodeType, TreeNode } from "@/types/tree";

/**
 * Determines the NodeType of a value
 */
export function getNodeType(value: unknown): NodeType {
  if (value === null) {
    return NodeType.Null;
  }
  if (Array.isArray(value)) {
    return NodeType.Array;
  }
  switch (typeof value) {
    case "object":
      return NodeType.Object;
    case "string":
      return NodeType.String;
    case "number":
      return NodeType.Number;
    case "boolean":
      return NodeType.Boolean;
    default:
      return NodeType.Null;
  }
}

/**
 * Builds a Jinja2 expression path segment
 * - Objects use dot notation: parent.key
 * - Arrays use bracket notation: parent[index]
 */
export function buildPath(
  parentPath: string,
  key: string,
  isArrayIndex: boolean
): string {
  if (isArrayIndex) {
    return `${parentPath}[${key}]`;
  }
  if (parentPath === "") {
    return key;
  }
  return `${parentPath}.${key}`;
}

/**
 * Converts a parsed JSON value to a TreeNode structure
 */
export function jsonToTree(
  json: unknown,
  key: string = "root",
  parentPath: string = "",
  isArrayIndex: boolean = false
): TreeNode {
  const type = getNodeType(json);
  const path = parentPath === "" && key === "root" ? "" : buildPath(parentPath, key, isArrayIndex);

  if (type === NodeType.Object && json !== null) {
    const obj = json as Record<string, unknown>;
    const children = Object.keys(obj).map((childKey) =>
      jsonToTree(obj[childKey], childKey, path, false)
    );
    return { key, type, path, children };
  }

  if (type === NodeType.Array) {
    const arr = json as unknown[];
    const children = arr.map((item, index) =>
      jsonToTree(item, String(index), path, true)
    );
    return { key, type, path, children };
  }

  // Primitive value
  return { key, type, path, value: json };
}

/**
 * Checks if a node type is expandable (has children)
 */
export function isExpandable(type: NodeType): boolean {
  return type === NodeType.Object || type === NodeType.Array;
}
