'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function MarkdownPreviewerTool() {
  const [input, setInput] = useState('');
  const [enableTables, setEnableTables] = useState(true);
  const [enableCodeHighlight, setEnableCodeHighlight] = useState(true);
  const [enableTaskLists, setEnableTaskLists] = useState(true);

  const parseMarkdown = (markdown: string): string => {
    if (!markdown.trim()) return '';

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

    // Code blocks
    if (enableCodeHighlight) {
      html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
        return `<pre class="code-block"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
      });
    } else {
      html = html.replace(/```[\s\S]*?```/gim, (match) => {
        const code = match.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
        return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
      });
    }

    // Inline code
    html = html.replace(/`(.*?)`/gim, '<code class="inline-code">$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

    // Task lists (if enabled)
    if (enableTaskLists) {
      html = html.replace(/^- \[x\] (.*$)/gim, '<div class="task-item"><input type="checkbox" checked disabled /> $1</div>');
      html = html.replace(/^- \[ \] (.*$)/gim, '<div class="task-item"><input type="checkbox" disabled /> $1</div>');
    }

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    // Tables (if enabled)
    if (enableTables) {
      html = html.replace(/\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)*)/gim, (match, header, rows) => {
        const headerCells = header.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        const headerRow = '<tr>' + headerCells.map((cell: string) => `<th>${cell}</th>`).join('') + '</tr>';
        
        const bodyRows = rows.trim().split('\n').map((row: string) => {
          const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
          return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
        }).join('');
        
        return `<table class="markdown-table"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
      });
    }

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr />');
    html = html.replace(/^\*\*\*$/gim, '<hr />');

    // Line breaks and paragraphs
    html = html.replace(/\n\n/gim, '</p><p>');
    html = html.replace(/\n/gim, '<br />');
    
    // Wrap in paragraphs
    if (html && !html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleExample = () => {
    const example = `# Markdown Preview Demo

## Features

This **Markdown Previewer** supports many features:

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- \`inline code\` and code blocks
- [Links](https://example.com)
- Images and tables

### Code Example

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Task List

- [x] Implement markdown parser
- [x] Add syntax highlighting
- [ ] Add more features
- [ ] Write documentation

### Table Example

| Feature | Status | Priority |
|---------|--------|----------|
| Headers | ✅ Done | High |
| Lists | ✅ Done | High |
| Tables | ✅ Done | Medium |
| Images | ✅ Done | Low |

### Blockquote

> This is a blockquote example.
> It can span multiple lines.

---

**Note:** This previewer supports GitHub Flavored Markdown syntax.`;
    setInput(example);
  };

  const getMarkdownStats = () => {
    if (!input) return { words: 0, characters: 0, lines: 0, headers: 0 };
    
    const words = input.trim().split(/\s+/).length;
    const characters = input.length;
    const lines = input.split('\n').length;
    const headers = (input.match(/^#+\s/gm) || []).length;
    
    return { words, characters, lines, headers };
  };

  const stats = getMarkdownStats();
  const htmlOutput = parseMarkdown(input);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Markdown Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableTables"
                checked={enableTables}
                onCheckedChange={setEnableTables}
              />
              <Label htmlFor="enableTables">Enable tables</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableCodeHighlight"
                checked={enableCodeHighlight}
                onCheckedChange={setEnableCodeHighlight}
              />
              <Label htmlFor="enableCodeHighlight">Code highlighting</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableTaskLists"
                checked={enableTaskLists}
                onCheckedChange={setEnableTaskLists}
              />
              <Label htmlFor="enableTaskLists">Task lists</Label>
            </div>
          </div>

          {stats.words > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{stats.words} words</Badge>
              <Badge variant="outline">{stats.characters} characters</Badge>
              <Badge variant="outline">{stats.lines} lines</Badge>
              <Badge variant="outline">{stats.headers} headers</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Markdown Source"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your Markdown here..."
          rows={15}
          example="Load example Markdown"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          
          <Card>
            <CardContent className="p-6">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
                style={{
                  lineHeight: '1.6',
                  color: '#333'
                }}
              />
              <style jsx>{`
                .prose h1 {
                  font-size: 2em;
                  font-weight: bold;
                  margin: 0.67em 0;
                  border-bottom: 1px solid #eee;
                  padding-bottom: 0.3em;
                }
                .prose h2 {
                  font-size: 1.5em;
                  font-weight: bold;
                  margin: 0.83em 0;
                  border-bottom: 1px solid #eee;
                  padding-bottom: 0.3em;
                }
                .prose h3 {
                  font-size: 1.17em;
                  font-weight: bold;
                  margin: 1em 0;
                }
                .prose ul {
                  list-style-type: disc;
                  margin-left: 1.5em;
                  margin: 1em 0;
                }
                .prose ol {
                  list-style-type: decimal;
                  margin-left: 1.5em;
                  margin: 1em 0;
                }
                .prose li {
                  margin: 0.5em 0;
                }
                .prose .code-block {
                  background: #f6f8fa;
                  border: 1px solid #e1e4e8;
                  border-radius: 6px;
                  padding: 16px;
                  overflow-x: auto;
                  margin: 1em 0;
                }
                .prose .inline-code {
                  background: #f6f8fa;
                  border-radius: 3px;
                  padding: 0.2em 0.4em;
                  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                  font-size: 85%;
                }
                .prose .markdown-table {
                  border-collapse: collapse;
                  width: 100%;
                  margin: 1em 0;
                }
                .prose .markdown-table th,
                .prose .markdown-table td {
                  border: 1px solid #dfe2e5;
                  padding: 6px 13px;
                  text-align: left;
                }
                .prose .markdown-table th {
                  background: #f6f8fa;
                  font-weight: bold;
                }
                .prose .task-item {
                  display: flex;
                  align-items: center;
                  gap: 0.5em;
                  margin: 0.25em 0;
                }
                .prose blockquote {
                  border-left: 4px solid #dfe2e5;
                  padding-left: 1em;
                  margin: 1em 0;
                  color: #6a737d;
                }
                .prose hr {
                  border: none;
                  border-top: 1px solid #e1e4e8;
                  margin: 2em 0;
                }
                .prose a {
                  color: #0366d6;
                  text-decoration: none;
                }
                .prose a:hover {
                  text-decoration: underline;
                }
              `}</style>
              
              {!htmlOutput && (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p>Enter Markdown text to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Markdown Previewer Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Supported syntax:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Text formatting:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>**bold** or __bold__</li>
                  <li>*italic* or _italic_</li>
                  <li>~~strikethrough~~</li>
                  <li>`inline code`</li>
                </ul>
              </div>
              <div>
                <strong>Structure:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li># Headers (H1-H3)</li>
                  <li>- Unordered lists</li>
                  <li>1. Ordered lists</li>
                  <li>&gt; Blockquotes</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Advanced features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>```code blocks``` with syntax highlighting</li>
              <li>[Links](url) and ![Images](url)</li>
              <li>Tables with | pipes |</li>
              <li>- [x] Task lists with checkboxes</li>
              <li>--- Horizontal rules</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Write and preview README files</li>
              <li>Create documentation</li>
              <li>Draft blog posts and articles</li>
              <li>Format text for GitHub, GitLab, etc.</li>
              <li>Learn Markdown syntax</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}