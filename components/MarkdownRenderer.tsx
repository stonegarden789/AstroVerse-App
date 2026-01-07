import React from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const cleanMarkdown = (text: string | undefined | null): string => {
  if (!text) return '';
  // Remove all asterisks completely as requested by user to "elimina definitiv * (stelutele)"
  let cleaned = text.replace(/\*/g, '');
  // Remove other artifacts if necessary, but the primary request is asterisks.
  cleaned = cleaned.replace(/^\s*(---|___)\s*$/gm, '');
  return cleaned;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  const cleanedContent = cleanMarkdown(content);
  // Note: It is crucial that the content is from a trusted source (like our AI)
  // as we are injecting HTML directly. `marked` will sanitize some content.
  const html = marked.parse(cleanedContent) as string;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};