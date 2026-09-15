import React from 'react';
import katex from 'katex';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface LatexProps {
  math?: string;
  content?: string;
  text?: string;
  children?: React.ReactNode;
  block?: boolean;
  className?: string;
}

export const renderKatexString = (formula: string, displayMode: boolean): string => {
  if (!formula || typeof formula !== 'string' || !formula.trim()) return '';
  try {
    return katex.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  } catch {
    return escapeHtml(formula);
  }
};

const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const Latex: React.FC<LatexProps> = ({
  math,
  content,
  text,
  children,
  block = false,
  className = '',
}) => {
  const rawInput =
    math ??
    content ??
    text ??
    (typeof children === 'string' ? children : '') ??
    '';

  const stringContent = typeof rawInput === 'string' ? rawInput : String(rawInput ?? '');

  if (!stringContent || !stringContent.trim()) {
    return null;
  }

  // Detect whether the content contains markdown structure or math delimiters
  const hasDelimiters = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/.test(stringContent);
  const hasMarkdownSyntax =
    /(\*\*|__|\*|_|###|##|#|`|^\s*[-*]\s+|^\s*\d+\.\s+)/m.test(stringContent) ||
    stringContent.includes('\n');

  // If it contains markdown syntax or math delimiters ($...$), render with MarkdownRenderer
  if (hasDelimiters || hasMarkdownSyntax) {
    // Treat as inline if block is not explicitly requested and there are no block markers or linebreaks
    const isMultiLineOrBlock =
      block ||
      stringContent.includes('\n') ||
      stringContent.includes('$$') ||
      /^(###|##|#|\s*[-*]\s+|\s*\d+\.\s+)/m.test(stringContent);

    return (
      <MarkdownRenderer
        content={stringContent}
        inline={!isMultiLineOrBlock}
        className={className}
      />
    );
  }

  // Pure LaTeX formula without $ delimiters (e.g. \vec{d} = \vec{d}_1 + \vec{d}_2, \frac{s}{t}, etc.)
  const isPureLatex = /\\[a-zA-Z]+|[_^]\{|\bfrac\b|\bDelta\b|\bbar\b|\bvec\b/.test(stringContent) || block;

  if (isPureLatex) {
    const html = renderKatexString(stringContent, block);
    return (
      <span
        className={`katex-wrapper ${block ? 'block my-2.5 text-center overflow-x-auto py-1' : 'inline-block px-0.5 align-middle'} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Plain text fallback
  return <span className={className}>{stringContent}</span>;
};

// Re-export MathText for backwards compatibility
export const MathText = Latex;
