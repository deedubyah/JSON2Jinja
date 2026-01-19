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
 * Renders a Nunjucks/Jinja2 template string against provided context data.
 * Returns a result object with either the rendered output or an error message.
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
    const output = env.renderString(template, context as object);
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
