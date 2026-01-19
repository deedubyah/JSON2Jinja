"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

interface ExpressionBuilderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ExpressionBuilderRef {
  insertAtCursor: (text: string) => void;
  focus: () => void;
}

const ExpressionBuilder = forwardRef<ExpressionBuilderRef, ExpressionBuilderProps>(
  function ExpressionBuilder({ value, onChange, placeholder, className }, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) {
          // Fallback: just append
          onChange(value + text);
          return;
        }

        // Insert at cursor position (NOT replacing selection)
        const cursorPos = textarea.selectionStart;
        const newValue = value.slice(0, cursorPos) + text + value.slice(cursorPos);
        onChange(newValue);

        // Move cursor after inserted text
        requestAnimationFrame(() => {
          const newCursorPos = cursorPos + text.length;
          textarea.selectionStart = newCursorPos;
          textarea.selectionEnd = newCursorPos;
          textarea.focus();
        });
      },
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

    return (
      <textarea
        ref={textareaRef}
        className={`code-area ${className || ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
);

export default ExpressionBuilder;
