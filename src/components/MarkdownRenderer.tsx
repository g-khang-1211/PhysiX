import React, { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export interface MarkdownRendererProps {
  content?: string;
  children?: string;
  className?: string;
  inline?: boolean;
}

/**
 * Preprocesses raw markdown text to ensure compatibility between standard physics text,
 * display math equations ($$...$$), inline math ($...$), and list blocks.
 */
function normalizeMarkdown(text: string): string {
  if (!text) return '';

  let normalized = text;

  // 1. Ensure $$ display math blocks have newlines before and after so remark-math parses them as block math
  normalized = normalized.replace(/([^\n])\s*\$\$([\s\S]+?)\$\$/g, '$1\n\n$$$$$2$$$$\n\n');
  normalized = normalized.replace(/\$\$([\s\S]+?)\$\$\s*([^\n])/g, '$$$$$1$$$$\n\n$2');

  return normalized;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  children,
  className = '',
  inline = false,
}) => {
  const rawText = content ?? children ?? '';

  const processedText = useMemo(() => {
    return normalizeMarkdown(rawText);
  }, [rawText]);

  if (!processedText.trim()) {
    return null;
  }

  return (
    <div className={`markdown-content ${inline ? 'inline' : 'block'} ${className}`}>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Inline mode turns paragraphs into spans to avoid breaking flex/table containers
          p: ({ children }) => {
            if (inline) {
              return <span className="inline">{children}</span>;
            }
            return (
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed my-2 first:mt-0 last:mb-0">
                {children}
              </p>
            );
          },
          h1: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-neutral-100 mt-5 mb-2.5">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-neutral-100 mt-4 mb-2">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-sm sm:text-base font-semibold text-neutral-200 mt-3.5 mb-1.5 flex items-center gap-1.5">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-semibold text-neutral-300 mt-3 mb-1 uppercase tracking-wide">
              {children}
            </h5>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2.5 pl-5 list-disc marker:text-neutral-500 text-sm sm:text-base text-neutral-300 leading-relaxed">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2.5 pl-5 list-decimal marker:text-neutral-500 text-sm sm:text-base text-neutral-300 leading-relaxed">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-100">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-neutral-200">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-3.5 py-2 border-l-2 border-indigo-500/70 bg-indigo-500/5 rounded-r-lg text-sm text-neutral-300 leading-relaxed">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-neutral-800" />,
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-neutral-800 text-amber-300 font-mono text-xs">
              {children}
            </code>
          ),
        }}
      >
        {processedText}
      </Markdown>
    </div>
  );
};
