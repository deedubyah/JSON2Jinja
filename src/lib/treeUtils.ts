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
 * Checks if a key requires bracket notation in Jinja2
 * Keys that start with a digit or contain special characters need bracket notation
 */
function requiresBracketNotation(key: string): boolean {
  if (/^\d/.test(key)) return true;
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) return true;
  return false;
}

/**
 * Builds a Jinja2 expression path segment
 * - Arrays use bracket notation: parent[index]
 * - Object keys starting with digit use bracket notation: parent["4"]
 * - Object keys with special chars use bracket notation: parent["my-key"]
 * - Regular object keys use dot notation: parent.key
 */
export function buildPath(
  parentPath: string,
  key: string,
  isArrayIndex: boolean
): string {
  if (isArrayIndex) {
    return `${parentPath}[${key}]`;
  }

  if (requiresBracketNotation(key)) {
    if (parentPath === "") {
      return `["${key}"]`;
    }
    return `${parentPath}["${key}"]`;
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

/**
 * Converts a path to a Jinja2 expression with proper spacing
 * Example: "user.address.city" -> "{{ user.address.city }}"
 */
export function pathToExpression(path: string): string {
  if (!path) {
    return "";
  }
  return `{{ ${path} }}`;
}
