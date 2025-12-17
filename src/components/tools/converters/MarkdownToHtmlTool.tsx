'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

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

      {/* Documentation */}
      <CollapsibleGuide title="Markdown to HTML Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Supported Markdown Syntax:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Headers:</strong> # ## ### → h1, h2, h3</li>
              <li><strong>Bold:</strong> **text** or __text__ → &lt;strong&gt;text&lt;/strong&gt;</li>
              <li><strong>Italic:</strong> *text* or _text_ → &lt;em&gt;text&lt;/em&gt;</li>
              <li><strong>Inline code:</strong> `code` → &lt;code&gt;code&lt;/code&gt;</li>
              <li><strong>Links:</strong> [text](url) → &lt;a href="url"&gt;text&lt;/a&gt;</li>
              <li><strong>Line breaks:</strong> New lines → &lt;br&gt;</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts basic Markdown syntax to HTML</li>
              <li>Real-time conversion as you type</li>
              <li>Supports common formatting elements</li>
              <li>Clean HTML output</li>
              <li>Preserves text structure and formatting</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converting Markdown documentation to HTML</li>
              <li>Preparing content for web publishing</li>
              <li>Creating HTML from README files</li>
              <li>Converting blog posts from Markdown to HTML</li>
              <li>Generating HTML for email templates</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">Markdown Input:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`# Title
**Bold text** and *italic text*
[Link](https://example.com)`}
                </pre>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">HTML Output:</h5>
                <pre className="bg-muted p-3 rounded text-xs font-mono">
{`<h1>Title</h1>
<strong>Bold text</strong> and <em>italic text</em>
<a href="https://example.com">Link</a>`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Basic implementation - doesn't support all Markdown features</li>
              <li>No support for tables, code blocks, or complex lists</li>
              <li>Limited to common formatting elements</li>
              <li>For full Markdown support, consider using a dedicated library</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}