"use client";

import type { ReactNode } from "react";
import styles from "./TheoryRenderer.module.css";

interface TheoryRendererProps {
  text: string;
}

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const raw = match[0];
    if (raw.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-${i}`}>{raw.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={`${keyPrefix}-${i}`} className={styles.inlineCode}>{raw.slice(1, -1)}</code>);
    }
    lastIndex = match.index + raw.length;
    i++;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function TheoryRenderer({ text }: TheoryRendererProps) {
  const nodes: ReactNode[] = [];

  // Split out fenced code blocks first
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const segments: Array<{ type: "text" | "code"; content: string; lang?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "code", lang: match[1], content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  segments.forEach((seg, si) => {
    if (seg.type === "code") {
      nodes.push(
        <pre key={`code-${si}`} className={styles.codeBlock}>
          <code>{seg.content.trimEnd()}</code>
        </pre>,
      );
      return;
    }

    const paragraphs = seg.content.split(/\n\n+/);

    paragraphs.forEach((para, pi) => {
      const trimmed = para.trim();
      if (!trimmed) return;

      const lines = trimmed.split("\n");
      const isAllList = lines.every((l) => l.startsWith("- ") || l.trim() === "");

      if (isAllList) {
        const items = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
        nodes.push(
          <ul key={`ul-${si}-${pi}`} className={styles.list}>
            {items.map((item, ii) => (
              <li key={ii}>{parseInline(item, `li-${si}-${pi}-${ii}`)}</li>
            ))}
          </ul>,
        );
      } else {
        nodes.push(
          <p key={`p-${si}-${pi}`} className={styles.paragraph}>
            {parseInline(trimmed.replace(/\n/g, " "), `p-${si}-${pi}`)}
          </p>,
        );
      }
    });
  });

  return <div className={styles.theory}>{nodes}</div>;
}
