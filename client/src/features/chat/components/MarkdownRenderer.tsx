import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@shared/lib/utils";

interface MarkdownRendererProps {
  content: string;
  /** Extra class on the root element */
  className?: string;
}

/**
 * Renders Markdown using `react-markdown` + `remark-gfm` (tables, strikethrough,
 * task lists). Every HTML element is mapped to a Tailwind-styled component that
 * matches the app design system (Plus Jakarta Sans, primary #4648D4 palette).
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("text-sm leading-5 text-foreground space-y-1", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* ── Headings ─────────────────────────────────────────────── */
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-foreground mt-2 mb-1 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-foreground mt-2 mb-0.5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-foreground mt-1.5 mb-0.5 first:mt-0">
              {children}
            </h3>
          ),

          /* ── Paragraph ────────────────────────────────────────────── */
          p: ({ children }) => <p className="leading-5 mb-1.5 last:mb-0">{children}</p>,

          /* ── Inline emphasis ──────────────────────────────────────── */
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,

          /* ── Inline code ──────────────────────────────────────────── */
          code: ({ children, className: cls }) => {
            const isBlock = Boolean(cls);
            if (isBlock) return <code>{children}</code>; // handled by <pre>
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-mono leading-none">
                {children}
              </code>
            );
          },

          /* ── Code block ───────────────────────────────────────────── */
          pre: ({ children }) => (
            <pre className="my-2 p-3 rounded-xl bg-foreground/[0.06] border border-border text-xs font-mono leading-5 overflow-x-auto whitespace-pre-wrap">
              {children}
            </pre>
          ),

          /* ── Lists ────────────────────────────────────────────────── */
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 mb-1.5">{children}</ul>,
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-0.5 mb-1.5">{children}</ol>
          ),
          li: ({ children }) => <li className="text-sm leading-5">{children}</li>,

          /* ── Blockquote ───────────────────────────────────────────── */
          blockquote: ({ children }) => (
            <blockquote className="border-l-[3px] border-primary pl-3 my-1.5 text-muted-foreground italic text-sm">
              {children}
            </blockquote>
          ),

          /* ── GFM Table ────────────────────────────────────────────── */
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/70">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border last:border-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="px-3 py-2 text-foreground text-xs">{children}</td>,

          /* ── Horizontal rule ──────────────────────────────────────── */
          hr: () => <hr className="my-2 border-border" />,

          /* ── Links ────────────────────────────────────────────────── */
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
