"use client";

import { useState, useRef } from "react";
import TwoPanel from "@/components/TwoPanel";
import JsonInput from "@/components/JsonInput";
import TreeView from "@/components/TreeView";
import ExpressionBuilder, { ExpressionBuilderRef } from "@/components/ExpressionBuilder";
import { renderTemplate } from "@/lib/templateRenderer";

export default function Home() {
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [expression, setExpression] = useState("");
  const [previewOutput, setPreviewOutput] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const expressionBuilderRef = useRef<ExpressionBuilderRef>(null);

  const handleParse = (data: unknown) => {
    setParsedData(data);
  };

  const handleExpressionGenerated = (expr: string) => {
    expressionBuilderRef.current?.insertAtCursor(expr);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(expression);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // Fallback: show error in preview area
      setPreviewOutput(null);
      setPreviewError("Failed to copy to clipboard. Please copy manually.");
    }
  };

  const handleReset = () => {
    setExpression("");
    setPreviewOutput(null);
    setPreviewError(null);
    setCopyFeedback(false);
    requestAnimationFrame(() => {
      expressionBuilderRef.current?.focus();
    });
  };

  const handleTestTemplate = () => {
    if (!parsedData) {
      setPreviewOutput(null);
      setPreviewError("No JSON data parsed. Please parse JSON first.");
      return;
    }

    const result = renderTemplate(expression, parsedData);

    if (result.success) {
      setPreviewOutput(result.output ?? "");
      setPreviewError(null);
    } else {
      setPreviewOutput(null);
      setPreviewError(result.error ?? "Unknown error");
    }
  };

  return (
    <TwoPanel
      leftPanel={
        <>
          <JsonInput onParse={handleParse} />
          <div className="mt-4">
            {parsedData ? (
              <TreeView
                data={parsedData}
                onExpressionGenerated={handleExpressionGenerated}
              />
            ) : (
              <p className="text-sm italic text-foreground-muted">Parse JSON to see tree view</p>
            )}
          </div>
        </>
      }
      rightPanel={
        <>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Jinja2 Expression Builder</h2>
          <ExpressionBuilder
            ref={expressionBuilderRef}
            value={expression}
            onChange={setExpression}
            placeholder="Click tree nodes to build expression..."
            className="w-full h-96 resize-none"
          />
          <div className="flex gap-2 mt-4">
            <button className="btn" onClick={handleCopy}>
              {copyFeedback ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button className="btn btn-success" onClick={handleTestTemplate}>
              Test Template
            </button>
            <button className="btn btn-danger" onClick={handleReset}>Reset</button>
          </div>
          <div className="mt-4">
            <div
              className={`preview-area w-full h-48 overflow-auto ${
                previewError ? "preview-error" : ""
              }`}
            >
              {previewError ? (
                <span className="text-error">{previewError}</span>
              ) : previewOutput !== null ? (
                <pre className="whitespace-pre-wrap">{previewOutput}</pre>
              ) : (
                <p className="text-sm italic text-foreground-muted">
                  Click &quot;Test Template&quot; to preview rendered output
                </p>
              )}
            </div>
          </div>
        </>
      }
    />
  );
}
