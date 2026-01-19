"use client";

import { useState, useRef } from "react";
import TwoPanel from "@/components/TwoPanel";
import JsonInput from "@/components/JsonInput";
import TreeView from "@/components/TreeView";

export default function Home() {
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [expression, setExpression] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = (data: unknown) => {
    setParsedData(data);
  };

  const handleExpressionGenerated = (expr: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback: just append
      setExpression((prev) => prev + expr);
      return;
    }

    // Insert at cursor position
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = expression.slice(0, start) + expr + expression.slice(end);
    setExpression(newValue);

    // Move cursor after inserted expression
    requestAnimationFrame(() => {
      textarea.selectionStart = start + expr.length;
      textarea.selectionEnd = start + expr.length;
      textarea.focus();
    });
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
          <textarea
            ref={textareaRef}
            className="code-area w-full h-96 resize-none"
            placeholder="Click tree nodes to build expression..."
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <button className="btn">Copy to Clipboard</button>
            <button className="btn btn-success">Test Template</button>
            <button className="btn btn-danger">Reset</button>
          </div>
          <div className="mt-4">
            <div className="code-area w-full h-48 bg-surface-elevated">
              {/* Preview output will be rendered here */}
              <p className="text-sm italic text-foreground-muted">Preview placeholder</p>
            </div>
          </div>
        </>
      }
    />
  );
}
