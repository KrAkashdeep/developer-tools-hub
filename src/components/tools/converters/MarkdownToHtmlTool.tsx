'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarkdownToHtmlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const markdownToHtml = (markdown: string) => {
    if (!markdown.trim()) {
      setOutput('');
      return;
    }

    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      // Code
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n/gim, '<br>');

    setOutput(html);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    markdownToHtml(value);
  };

  const handleExample = () => {
    const example = `# Main Title

## Subtitle

This is a paragraph with **bold text** and *italic text*.

Here's a [link](https://example.com) and some \`inline code\`.

### List:
- Item 1
- Item 2
- Item 3`;
    setInput(example);
    markdownToHtml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Markdown Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Markdown text..."
          example="Load example Markdown"
          onExample={handleExample}
        />
        <OutputBox
          title="HTML Output"
          value={output}
          placeholder="HTML will appear here..."
        />
      </ToolLayout>

      <Card>
        <CardHeader>
          <CardTitle>Markdown to HTML Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Converts Markdown syntax to HTML. Supports headers, bold, italic, links, and inline code.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}