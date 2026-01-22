import { describe, it, expect } from "vitest";
import { renderTemplate } from "./templateRenderer";

describe("renderTemplate", () => {
  describe("successful rendering", () => {
    it("renders simple variable", () => {
      const result = renderTemplate("Hello {{ name }}!", { name: "World" });
      expect(result.success).toBe(true);
      expect(result.output).toBe("Hello World!");
    });

    it("renders nested variable", () => {
      const result = renderTemplate("{{ user.name }}", { user: { name: "Alice" } });
      expect(result.success).toBe(true);
      expect(result.output).toBe("Alice");
    });

    it("renders array access", () => {
      const result = renderTemplate("{{ items[0] }}", { items: ["first", "second"] });
      expect(result.success).toBe(true);
      expect(result.output).toBe("first");
    });

    it("renders plain text without variables", () => {
      const result = renderTemplate("Hello World!", {});
      expect(result.success).toBe(true);
      expect(result.output).toBe("Hello World!");
    });

    it("renders multiple variables", () => {
      const result = renderTemplate("{{ first }} and {{ second }}", {
        first: "A",
        second: "B",
      });
      expect(result.success).toBe(true);
      expect(result.output).toBe("A and B");
    });

    it("renders with filters", () => {
      const result = renderTemplate("{{ name | upper }}", { name: "alice" });
      expect(result.success).toBe(true);
      expect(result.output).toBe("ALICE");
    });

    it("renders boolean values", () => {
      const result = renderTemplate("{{ active }}", { active: true });
      expect(result.success).toBe(true);
      expect(result.output).toBe("true");
    });

    it("renders number values", () => {
      const result = renderTemplate("Count: {{ count }}", { count: 42 });
      expect(result.success).toBe(true);
      expect(result.output).toBe("Count: 42");
    });
  });

  describe("automatic array/object formatting", () => {
    it("formats array as JSON automatically", () => {
      const result = renderTemplate("{{ items }}", { items: ["a", "b", "c"] });
      expect(result.success).toBe(true);
      expect(result.output).toBe('[\n  "a",\n  "b",\n  "c"\n]');
    });

    it("formats object as JSON automatically", () => {
      const result = renderTemplate("{{ user }}", { user: { name: "Alice" } });
      expect(result.success).toBe(true);
      expect(result.output).toBe('{\n  "name": "Alice"\n}');
    });

    it("formats nested array of objects", () => {
      const result = renderTemplate("{{ items }}", {
        items: [{ id: 1 }, { id: 2 }]
      });
      expect(result.success).toBe(true);
      expect(result.output).toContain('"id": 1');
      expect(result.output).toContain('"id": 2');
    });

    it("still allows property access on wrapped objects", () => {
      const result = renderTemplate("{{ user.name }}", { user: { name: "Alice" } });
      expect(result.success).toBe(true);
      expect(result.output).toBe("Alice");
    });

    it("still allows index access on wrapped arrays", () => {
      const result = renderTemplate("{{ items[0] }}", { items: ["first", "second"] });
      expect(result.success).toBe(true);
      expect(result.output).toBe("first");
    });

    it("still allows iteration on wrapped arrays", () => {
      const result = renderTemplate(
        "{% for item in items %}{{ item }},{% endfor %}",
        { items: ["a", "b", "c"] }
      );
      expect(result.success).toBe(true);
      expect(result.output).toBe("a,b,c,");
    });
  });

  describe("json filter", () => {
    it("formats array as JSON", () => {
      const result = renderTemplate("{{ items | json }}", { items: ["a", "b", "c"] });
      expect(result.success).toBe(true);
      expect(result.output).toBe('[\n  "a",\n  "b",\n  "c"\n]');
    });

    it("formats object as JSON", () => {
      const result = renderTemplate("{{ user | json }}", { user: { name: "Alice", age: 30 } });
      expect(result.success).toBe(true);
      expect(result.output).toBe('{\n  "name": "Alice",\n  "age": 30\n}');
    });

    it("formats array of objects as JSON", () => {
      const result = renderTemplate("{{ items | json }}", {
        items: [{ id: 1 }, { id: 2 }]
      });
      expect(result.success).toBe(true);
      expect(result.output).toContain('"id": 1');
      expect(result.output).toContain('"id": 2');
    });

    it("accepts custom indentation", () => {
      const result = renderTemplate("{{ items | json(0) }}", { items: ["a", "b"] });
      expect(result.success).toBe(true);
      expect(result.output).toBe('["a","b"]');
    });

    it("formats primitive values", () => {
      const result = renderTemplate("{{ value | json }}", { value: "test" });
      expect(result.success).toBe(true);
      expect(result.output).toBe('"test"');
    });
  });

  describe("error handling", () => {
    it("returns error for empty template", () => {
      const result = renderTemplate("", { name: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Template is empty");
    });

    it("returns error for whitespace-only template", () => {
      const result = renderTemplate("   ", { name: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Template is empty");
    });

    it("returns error for undefined variable", () => {
      const result = renderTemplate("{{ missing }}", {});
      expect(result.success).toBe(false);
      expect(result.error).toContain("undefined");
    });

    it("returns error for deeply nested undefined", () => {
      const result = renderTemplate("{{ user.profile.name }}", { user: {} });
      expect(result.success).toBe(false);
      expect(result.error).toContain("undefined");
    });

    it("returns error for syntax errors", () => {
      const result = renderTemplate("{{ name", { name: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("returns error for invalid filter", () => {
      const result = renderTemplate("{{ name | nonexistentfilter }}", { name: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles empty object context", () => {
      const result = renderTemplate("Static text", {});
      expect(result.success).toBe(true);
      expect(result.output).toBe("Static text");
    });

    it("handles null values in context", () => {
      const result = renderTemplate("Value: {{ value }}", { value: null });
      expect(result.success).toBe(false); // throwOnUndefined treats null as error
    });

    it("handles array iteration", () => {
      const result = renderTemplate(
        "{% for item in items %}{{ item }}{% endfor %}",
        { items: ["a", "b", "c"] }
      );
      expect(result.success).toBe(true);
      expect(result.output).toBe("abc");
    });

    it("handles conditionals", () => {
      const result = renderTemplate(
        "{% if show %}visible{% endif %}",
        { show: true }
      );
      expect(result.success).toBe(true);
      expect(result.output).toBe("visible");
    });

    it("handles special characters in output", () => {
      const result = renderTemplate("{{ text }}", { text: "<script>alert('xss')</script>" });
      expect(result.success).toBe(true);
      // autoescape is false, so raw output
      expect(result.output).toBe("<script>alert('xss')</script>");
    });
  });
});
