/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("Home Page Integration Tests", () => {
  beforeEach(() => {
    cleanup();
    mockWriteText.mockClear();
  });

  describe("JSON Parsing", () => {
    it("parses valid JSON and renders tree", async () => {
      render(<Home />);

      const textarea = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(textarea, { target: { value: '{"name": "Alice", "age": 30}' } });
      fireEvent.click(parseButton);

      // Tree should render with the keys
      await waitFor(() => {
        expect(screen.getByText("name")).toBeInTheDocument();
        expect(screen.getByText("age")).toBeInTheDocument();
      });
    });

    it("displays error for invalid JSON", async () => {
      render(<Home />);

      const textarea = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(textarea, { target: { value: "not valid json {" } });
      fireEvent.click(parseButton);

      // Error should be displayed
      await waitFor(() => {
        const errorElement = document.querySelector(".text-error");
        expect(errorElement).toBeInTheDocument();
      });
    });

    it("handles empty JSON object", async () => {
      render(<Home />);

      const textarea = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(textarea, { target: { value: "{}" } });
      fireEvent.click(parseButton);

      await waitFor(() => {
        expect(screen.getByText(/empty object/i)).toBeInTheDocument();
      });
    });

    it("handles empty JSON array", async () => {
      render(<Home />);

      const textarea = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(textarea, { target: { value: "[]" } });
      fireEvent.click(parseButton);

      await waitFor(() => {
        expect(screen.getByText(/empty array/i)).toBeInTheDocument();
      });
    });
  });

  describe("Tree Node Interaction", () => {
    it("clicking tree node inserts expression into builder", async () => {
      render(<Home />);

      // Parse JSON first
      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"user": {"name": "Bob"}}' } });
      fireEvent.click(parseButton);

      // Wait for tree to render
      await waitFor(() => {
        expect(screen.getByText("user")).toBeInTheDocument();
      });

      // Expand user node by clicking the arrow
      const userArrow = screen.getByText("▼"); // First expanded node
      expect(userArrow).toBeInTheDocument();

      // Click on the "name" label to insert expression
      const nameLabel = screen.getByText("name");
      fireEvent.click(nameLabel);

      // Expression builder should contain the expression
      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      expect(expressionBuilder).toHaveValue("{{ user.name }}");
    });

    it("clicking array parent inserts array path, not first element", async () => {
      render(<Home />);

      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"items": ["a", "b", "c"]}' } });
      fireEvent.click(parseButton);

      await waitFor(() => {
        expect(screen.getByText("items")).toBeInTheDocument();
      });

      // Click on "items" label (the array parent)
      const itemsLabel = screen.getByText("items");
      fireEvent.click(itemsLabel);

      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      // Should be {{ items }}, NOT {{ items[0] }}
      expect(expressionBuilder).toHaveValue("{{ items }}");
    });

    it("clicking array element inserts bracketed path", async () => {
      render(<Home />);

      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"items": ["first", "second"]}' } });
      fireEvent.click(parseButton);

      await waitFor(() => {
        expect(screen.getByText("items")).toBeInTheDocument();
      });

      // Expand the array if collapsed - click on the arrow (works for both ► and ▼)
      const arrow = screen.getByTitle("Click to expand/collapse");
      // Only click if currently collapsed
      if (arrow.textContent === "►") {
        fireEvent.click(arrow);
      }

      // Find and click on the "0" index
      await waitFor(() => {
        expect(screen.getByText("0")).toBeInTheDocument();
      });

      const indexLabel = screen.getByText("0");
      fireEvent.click(indexLabel);

      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      expect(expressionBuilder).toHaveValue("{{ items[0] }}");
    });
  });

  describe("Template Preview", () => {
    it("renders template with Test button", async () => {
      render(<Home />);

      // Parse JSON
      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"greeting": "Hello World"}' } });
      fireEvent.click(parseButton);

      // Type expression manually
      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      fireEvent.change(expressionBuilder, { target: { value: "Message: {{ greeting }}" } });

      // Click Test Template
      const testButton = screen.getByRole("button", { name: /test template/i });
      fireEvent.click(testButton);

      // Preview should show rendered output
      await waitFor(() => {
        expect(screen.getByText("Message: Hello World")).toBeInTheDocument();
      });
    });

    it("shows error for undefined variable", async () => {
      render(<Home />);

      // Parse JSON
      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } });
      fireEvent.click(parseButton);

      // Type expression with undefined variable
      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      fireEvent.change(expressionBuilder, { target: { value: "{{ missing }}" } });

      // Click Test Template
      const testButton = screen.getByRole("button", { name: /test template/i });
      fireEvent.click(testButton);

      // Error should be displayed
      await waitFor(() => {
        const previewArea = document.querySelector(".preview-error");
        expect(previewArea).toBeInTheDocument();
      });
    });

    it("shows error when no JSON parsed", async () => {
      render(<Home />);

      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      fireEvent.change(expressionBuilder, { target: { value: "{{ name }}" } });

      const testButton = screen.getByRole("button", { name: /test template/i });
      fireEvent.click(testButton);

      await waitFor(() => {
        expect(screen.getByText(/no json data parsed/i)).toBeInTheDocument();
      });
    });
  });

  describe("Copy to Clipboard", () => {
    it("copies expression to clipboard and shows feedback", async () => {
      render(<Home />);

      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      fireEvent.change(expressionBuilder, { target: { value: "{{ name }}" } });

      const copyButton = screen.getByRole("button", { name: /copy to clipboard/i });
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledWith("{{ name }}");

      // Should show "Copied!" feedback
      await waitFor(() => {
        expect(screen.getByText(/copied!/i)).toBeInTheDocument();
      });
    });
  });

  describe("Reset Functionality", () => {
    it("clears expression builder but preserves JSON and tree", async () => {
      render(<Home />);

      // Parse JSON
      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"name": "Alice"}' } });
      fireEvent.click(parseButton);

      await waitFor(() => {
        expect(screen.getByText("name")).toBeInTheDocument();
      });

      // Type in expression builder
      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      fireEvent.change(expressionBuilder, { target: { value: "Hello {{ name }}" } });

      // Click Test to generate preview
      const testButton = screen.getByRole("button", { name: /test template/i });
      fireEvent.click(testButton);

      await waitFor(() => {
        expect(screen.getByText("Hello Alice")).toBeInTheDocument();
      });

      // Click Reset
      const resetButton = screen.getByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      // Expression builder should be cleared
      expect(expressionBuilder).toHaveValue("");

      // Preview should show placeholder again
      expect(screen.queryByText("Hello Alice")).not.toBeInTheDocument();

      // But tree should still be visible
      expect(screen.getByText("name")).toBeInTheDocument();

      // And JSON input should still have the value
      expect(jsonInput).toHaveValue('{"name": "Alice"}');
    });

    it("clears error messages on reset", async () => {
      render(<Home />);

      // Parse JSON
      const jsonInput = screen.getByPlaceholderText(/paste your json/i);
      const parseButton = screen.getByRole("button", { name: /parse json/i });

      fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } });
      fireEvent.click(parseButton);

      // Type invalid expression
      const expressionBuilder = screen.getByPlaceholderText(/click tree nodes/i);
      fireEvent.change(expressionBuilder, { target: { value: "{{ missing }}" } });

      const testButton = screen.getByRole("button", { name: /test template/i });
      fireEvent.click(testButton);

      // Wait for error
      await waitFor(() => {
        expect(document.querySelector(".preview-error")).toBeInTheDocument();
      });

      // Reset
      const resetButton = screen.getByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      // Error should be cleared
      expect(document.querySelector(".preview-error")).not.toBeInTheDocument();
    });
  });
});
