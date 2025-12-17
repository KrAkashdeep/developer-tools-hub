'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function HtmlToMarkdownTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const htmlToMarkdown = (html: string) => {
    if (!html.trim()) {
      setOutput('');
      return;
    }

    try {
      let markdown = html
        // Headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/gim, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gim, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gim, '### $1\n\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gim, '#### $1\n\n')
        .replace(/<h5[^>]*>(.*?)<\/h5>/gim, '##### $1\n\n')
        .replace(/<h6[^>]*>(.*?)<\/h6>/gim, '###### $1\n\n')
        
        // Bold
        .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gim, '**$2**')
        
        // Italic
        .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gim, '*$2*')
        
        // Code
        .replace(/<code[^>]*>(.*?)<\/code>/gim, '`$1`')
        .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gim, '```\n$1\n```\n')
        .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gim, '```\n$1\n```\n')
        
        // Links
        .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gim, '[$2]($1)')
        
        // Images
        .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gim, '![$2]($1)')
        .replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gim, '![$1]($2)')
        .replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gim, '![]($1)')
        
        // Lists
        .replace(/<ul[^>]*>/gim, '')
        .replace(/<\/ul>/gim, '\n')
        .replace(/<ol[^>]*>/gim, '')
        .replace(/<\/ol>/gim, '\n')
        .replace(/<li[^>]*>(.*?)<\/li>/gim, '- $1\n')
        
        // Paragraphs
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gim, '$1\n\n')
        
        // Line breaks
        .replace(/<br[^>]*\/?>/gim, '\n')
        
        // Blockquotes
        .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gim, (match, content) => {
          return content.split('\n').map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
        })
        
        // Horizontal rules
        .replace(/<hr[^>]*\/?>/gim, '---\n\n')
        
        // Remove remaining HTML tags
        .replace(/<[^>]*>/gim, '')
        
        // Clean up HTML entities
        .replace(/&nbsp;/gim, ' ')
        .replace(/&amp;/gim, '&')
        .replace(/&lt;/gim, '<')
        .replace(/&gt;/gim, '>')
        .replace(/&quot;/gim, '"')
        .replace(/&#39;/gim, "'")
        
        // Clean up extra whitespace
        .replace(/\n\s*\n\s*\n/gim, '\n\n')
        .trim();

      setOutput(markdown);
    } catch (error) {
      setOutput(`Error converting HTML to Markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    htmlToMarkdown(value);
  };

  const handleExample = () => {
    const example = `<h1>Main Title</h1>
<h2>Subtitle</h2>
<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<p>Here's a <a href="https://example.com">link</a> and some <code>inline code</code>.</p>
<h3>Features:</h3>
<ul>
  <li>Convert HTML to Markdown</li>
  <li>Support for headers, links, and formatting</li>
  <li>Handle lists and code blocks</li>
</ul>
<blockquote>
  <p>This is a blockquote with some important information.</p>
</blockquote>
<pre><code>console.log("Hello, World!");</code></pre>`;
    setInput(example);
    htmlToMarkdown(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="HTML Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your HTML code here..."
          rows={12}
          example="Load example HTML"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Markdown Output"
          value={output}
          placeholder="Markdown will appear here..."
          rows={12}
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="HTML to Markdown Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Supported HTML Elements:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Headers:</strong> h1-h6 → # ## ### #### ##### ######</li>
              <li><strong>Text formatting:</strong> strong/b → **bold**, em/i → *italic*</li>
              <li><strong>Links:</strong> a → [text](url)</li>
              <li><strong>Images:</strong> img → ![alt](src)</li>
              <li><strong>Code:</strong> code → `inline`, pre → ```block```</li>
              <li><strong>Lists:</strong> ul/ol/li → - item</li>
              <li><strong>Blockquotes:</strong> blockquote → &gt; quote</li>
              <li><strong>Paragraphs:</strong> p → text with line breaks</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts common HTML elements to Markdown syntax</li>
              <li>Preserves text formatting and structure</li>
              <li>Handles nested elements appropriately</li>
              <li>Cleans up HTML entities and extra whitespace</li>
              <li>Removes unsupported HTML tags</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converting web content to Markdown for documentation</li>
              <li>Migrating from HTML-based systems to Markdown</li>
              <li>Creating README files from HTML content</li>
              <li>Preparing content for static site generators</li>
              <li>Converting rich text editor output to Markdown</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Limitations:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Complex HTML structures may not convert perfectly</li>
              <li>CSS styling information is lost</li>
              <li>Some HTML elements don't have Markdown equivalents</li>
              <li>Nested lists may require manual adjustment</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}