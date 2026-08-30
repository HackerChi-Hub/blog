import React from 'react';

export default function MarkdownContent({ html = '' }) {
  if (!html) return null;
  return (
    <article
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

