"use client";

import { useTheme } from "next-themes";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coldarkCold,
  coldarkDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function MarkdownRenderer({ content }: { content: string }) {
  const { theme } = useTheme();

  return (
    <ReactMarkdown
      className="w-full prose prose-zinc dark:prose-invert grid sm:grid-cols-1 prose-pre:bg-background prose-pre:border prose-pre:shadow-sm prose-p:text-primary"
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              PreTag="div"
              style={theme == "light" ? coldarkCold : coldarkDark}
              customStyle={{
                background: "transparent",
              }}
              showLineNumbers
            />
          ) : (
            <code {...props}>{children}</code>
          );
        },
      }}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  );
}
