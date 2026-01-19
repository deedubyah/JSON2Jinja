export enum NodeType {
  Object = "object",
  Array = "array",
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Null = "null",
}

export interface TreeNode {
  /** The key/property name (or array index as string) */
  key: string;
  /** The original value (for primitives) or undefined (for objects/arrays) */
  value?: unknown;
  /** The type of this node */
  type: NodeType;
  /** The Jinja2 expression path to this node (e.g., "user.address.city" or "items[0].name") */
  path: string;
  /** Child nodes (for objects and arrays) */
  children?: TreeNode[];
}
