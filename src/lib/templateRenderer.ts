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
    // Spread context at root for normal access, add under "data" for bracket notation
    const wrappedContext = { ...(context as object), data: context };

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
