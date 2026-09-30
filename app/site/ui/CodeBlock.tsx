"use client";

import { useRef, useState } from "react";

// Code stays server-rendered and selectable; the button copies it and reports the result.
export default function CodeBlock({ code, language, filename }: { code: string; language: string; filename: string }) {
  const codeRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
    } catch {
      const selection = window.getSelection();
      if (selection && codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("Selected — press Ctrl+C or ⌘C");
    }
    window.setTimeout(() => setStatus(""), 2400);
  };
  return <figure className="ab-code">
    <figcaption className="ab-code__bar">
      <span className="ab-code__file">{filename}</span>
      <span className="ab-code__lang">{language}</span>
      <button type="button" className="ab-code__copy" onClick={copy} aria-label={`Copy ${filename}`}>{status === "Copied" ? "Copied ✓" : "Copy"}</button>
      <span className="ab-code__status" role="status" aria-live="polite">{status && status !== "Copied" ? status : status ? "Code copied to clipboard" : ""}</span>
    </figcaption>
    <pre tabIndex={0} aria-label={`${filename} source`}><code ref={codeRef}>{code}</code></pre>
  </figure>;
}
