"use client";

import { useState } from "react";

interface JsonInputProps {
  onParse: (data: unknown) => void;
}

export default function JsonInput({ onParse }: JsonInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(input);
      setError(null);
      onParse(parsed);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(`Invalid JSON: ${e.message}`);
      } else {
        setError("An unexpected error occurred while parsing JSON");
      }
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-foreground">JSON Input</h2>
      <textarea
        className="code-area w-full h-48 resize-none"
        placeholder="Paste your JSON here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-4">
        <button className="btn" onClick={handleParse}>
          Parse JSON
        </button>
      </div>
      {error && (
        <div className="mt-4 text-error">
          {error}
        </div>
      )}
    </>
  );
}
