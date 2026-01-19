import { describe, it, expect } from "vitest";
import {
  getNodeType,
  buildPath,
  jsonToTree,
  isExpandable,
  pathToExpression,
} from "./treeUtils";
import { NodeType } from "@/types/tree";

describe("getNodeType", () => {
  it("returns Null for null", () => {
    expect(getNodeType(null)).toBe(NodeType.Null);
  });

  it("returns Array for arrays", () => {
    expect(getNodeType([])).toBe(NodeType.Array);
    expect(getNodeType([1, 2, 3])).toBe(NodeType.Array);
  });

  it("returns Object for objects", () => {
    expect(getNodeType({})).toBe(NodeType.Object);
    expect(getNodeType({ a: 1 })).toBe(NodeType.Object);
  });

  it("returns String for strings", () => {
    expect(getNodeType("")).toBe(NodeType.String);
    expect(getNodeType("hello")).toBe(NodeType.String);
  });

  it("returns Number for numbers", () => {
    expect(getNodeType(0)).toBe(NodeType.Number);
    expect(getNodeType(42)).toBe(NodeType.Number);
    expect(getNodeType(-3.14)).toBe(NodeType.Number);
  });

  it("returns Boolean for booleans", () => {
    expect(getNodeType(true)).toBe(NodeType.Boolean);
    expect(getNodeType(false)).toBe(NodeType.Boolean);
  });

  it("returns Null for undefined", () => {
    expect(getNodeType(undefined)).toBe(NodeType.Null);
  });
});

describe("buildPath", () => {
  it("returns key for empty parent path (non-array)", () => {
    expect(buildPath("", "name", false)).toBe("name");
  });

  it("uses dot notation for object keys", () => {
    expect(buildPath("user", "name", false)).toBe("user.name");
    expect(buildPath("data.user", "email", false)).toBe("data.user.email");
  });

  it("uses bracket notation for array indices", () => {
    expect(buildPath("items", "0", true)).toBe("items[0]");
    expect(buildPath("data.items", "5", true)).toBe("data.items[5]");
  });

  it("handles nested array within object", () => {
    expect(buildPath("users[0]", "name", false)).toBe("users[0].name");
  });
});

describe("jsonToTree", () => {
  it("converts primitive string", () => {
    const tree = jsonToTree("hello");
    expect(tree.type).toBe(NodeType.String);
    expect(tree.value).toBe("hello");
    expect(tree.key).toBe("root");
    expect(tree.path).toBe("");
  });

  it("converts primitive number", () => {
    const tree = jsonToTree(42);
    expect(tree.type).toBe(NodeType.Number);
    expect(tree.value).toBe(42);
  });

  it("converts null", () => {
    const tree = jsonToTree(null);
    expect(tree.type).toBe(NodeType.Null);
  });

  it("converts empty object", () => {
    const tree = jsonToTree({});
    expect(tree.type).toBe(NodeType.Object);
    expect(tree.children).toEqual([]);
  });

  it("converts empty array", () => {
    const tree = jsonToTree([]);
    expect(tree.type).toBe(NodeType.Array);
    expect(tree.children).toEqual([]);
  });

  it("converts simple object", () => {
    const tree = jsonToTree({ name: "Alice", age: 30 });
    expect(tree.type).toBe(NodeType.Object);
    expect(tree.children).toHaveLength(2);

    const nameChild = tree.children?.find((c) => c.key === "name");
    expect(nameChild?.type).toBe(NodeType.String);
    expect(nameChild?.value).toBe("Alice");
    expect(nameChild?.path).toBe("name");

    const ageChild = tree.children?.find((c) => c.key === "age");
    expect(ageChild?.type).toBe(NodeType.Number);
    expect(ageChild?.value).toBe(30);
    expect(ageChild?.path).toBe("age");
  });

  it("converts simple array", () => {
    const tree = jsonToTree(["a", "b", "c"]);
    expect(tree.type).toBe(NodeType.Array);
    expect(tree.children).toHaveLength(3);

    expect(tree.children?.[0].key).toBe("0");
    expect(tree.children?.[0].path).toBe("[0]");
    expect(tree.children?.[0].value).toBe("a");

    expect(tree.children?.[1].path).toBe("[1]");
    expect(tree.children?.[2].path).toBe("[2]");
  });

  it("converts deeply nested structure", () => {
    const data = {
      user: {
        profile: {
          name: "Bob",
        },
      },
    };
    const tree = jsonToTree(data);

    const user = tree.children?.[0];
    expect(user?.key).toBe("user");
    expect(user?.path).toBe("user");

    const profile = user?.children?.[0];
    expect(profile?.key).toBe("profile");
    expect(profile?.path).toBe("user.profile");

    const name = profile?.children?.[0];
    expect(name?.key).toBe("name");
    expect(name?.path).toBe("user.profile.name");
    expect(name?.value).toBe("Bob");
  });

  it("converts array of objects", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const tree = jsonToTree(data);

    expect(tree.type).toBe(NodeType.Array);
    expect(tree.children?.[0].path).toBe("[0]");
    expect(tree.children?.[0].children?.[0].path).toBe("[0].id");
    expect(tree.children?.[1].children?.[0].path).toBe("[1].id");
  });

  it("handles special characters in keys", () => {
    const data = { "my-key": "value", "another.key": "value2" };
    const tree = jsonToTree(data);

    expect(tree.children?.[0].key).toBe("my-key");
    expect(tree.children?.[0].path).toBe("my-key");
  });
});

describe("isExpandable", () => {
  it("returns true for Object", () => {
    expect(isExpandable(NodeType.Object)).toBe(true);
  });

  it("returns true for Array", () => {
    expect(isExpandable(NodeType.Array)).toBe(true);
  });

  it("returns false for primitives", () => {
    expect(isExpandable(NodeType.String)).toBe(false);
    expect(isExpandable(NodeType.Number)).toBe(false);
    expect(isExpandable(NodeType.Boolean)).toBe(false);
    expect(isExpandable(NodeType.Null)).toBe(false);
  });
});

describe("pathToExpression", () => {
  it("returns empty string for empty path", () => {
    expect(pathToExpression("")).toBe("");
  });

  it("wraps path in Jinja2 expression syntax", () => {
    expect(pathToExpression("name")).toBe("{{ name }}");
    expect(pathToExpression("user.email")).toBe("{{ user.email }}");
    expect(pathToExpression("items[0]")).toBe("{{ items[0] }}");
    expect(pathToExpression("data.items[0].name")).toBe("{{ data.items[0].name }}");
  });
});
