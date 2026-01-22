import nunjucks from "nunjucks";

export interface RenderResult {
  success: boolean;
  output?: string;
  error?: string;
}

// Configure Nunjucks environment
const env = new nunjucks.Environment(null, {
  autoescape: false,
  throwOnUndefined: true,
});

// Add custom 'json' filter for pretty-printing arrays and objects (kept for explicit use)
env.addFilter("json", (value: unknown, indent?: number) => {
  return JSON.stringify(value, null, indent ?? 2);
});

/**
 * Wraps a value so arrays and objects automatically stringify to JSON.
 * This makes preview output user-friendly without modifying the template.
 */
function wrapForPreview(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    // Create a custom array that stringifies to JSON
    const wrapped = value.map(wrapForPreview);
    Object.defineProperty(wrapped, "toString", {
      value: () => JSON.stringify(value, null, 2),
      enumerable: false,
    });
    return wrapped;
  }

  if (typeof value === "object") {
    // Create a proxy that stringifies to JSON but allows property access
    const wrappedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      wrappedObj[key] = wrapForPreview(val);
    }
    Object.defineProperty(wrappedObj, "toString", {
      value: () => JSON.stringify(value, null, 2),
      enumerable: false,
    });
    return wrappedObj;
  }

  return value;
}

/**
 * Transforms bracket-notation expressions to use data prefix.
 * Only transforms expressions starting with [ like {{ ["3"].foo }}
 * Other expressions work via spreading context at root level.
 */
function transformBracketExpressions(template: string): string {
  // Transform {{ ["key"]... }} to {{ data["key"]... }}
  return template.replace(
    /\{\{\s*\[/g,
    '{{ data['
  ).replace(
    /\{%\s*for\s+(\w+)\s+in\s*\[/g,
    '{% for $1 in data['
  ).replace(
    /\{%\s*if\s*\[/g,
    '{% if data['
  );
}

/**
 * Renders a Nunjucks/Jinja2 template string against provided context data.
 * Context is spread at root level for normal access, and also available
 * under "data" for bracket-notation expressions like {{ data["3"].foo }}.
 */
export function renderTemplate(
  template: string,
  context: unknown
): RenderResult {
  if (!template.trim()) {
    return {
      success: false,
      error: "Template is empty",
    };
  }

  try {
    // Transform bracket expressions to use data prefix
    const transformedTemplate = transformBracketExpressions(template);
    // Wrap context so arrays/objects stringify to JSON in preview
    const previewContext = wrapForPreview(context);
    // Spread context at root for normal access, add under "data" for bracket notation
    const wrappedContext = { ...(previewContext as object), data: previewContext };

    const output = env.renderString(transformedTemplate, wrappedContext);
    return {
      success: true,
      output,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);

    // Make error messages more user-friendly
    let friendlyError = error;

    // Handle undefined variable errors
    if (error.includes("attempted to output null or undefined")) {
      const match = error.match(/variable "([^"]+)"/);
      if (match) {
        friendlyError = `Undefined variable: "${match[1]}" is not defined in the JSON data`;
      } else {
        friendlyError = "Template references an undefined variable";
      }
    }

    // Handle syntax errors
    if (error.includes("unexpected token") || error.includes("expected")) {
      friendlyError = `Template syntax error: ${error}`;
    }

    return {
      success: false,
      error: friendlyError,
    };
  }
}
