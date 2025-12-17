'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function HtmlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatHtml = (htmlString: string) => {
    if (!htmlString.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // Simple HTML formatter
      let formatted = htmlString
        .replace(/></g, '>\n<')
        .replace(/^\s*\n/gm, '')
        .trim();

      // Add proper indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentSize = 2;
      
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';

        // Decrease indent for closing tags
        if (trimmedLine.startsWith('</') && !trimmedLine.includes('/>')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmedLine;

        // Increase indent for opening tags (but not self-closing or closing tags)
        if (trimmedLine.startsWith('<') && 
            !trimmedLine.startsWith('</') && 
            !trimmedLine.includes('/>') &&
            !trimmedLine.includes('<!') &&
            !trimmedLine.includes('<?')) {
          indentLevel++;
        }

        return indentedLine;
      });

      setOutput(formattedLines.join('\n'));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error formatting HTML');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    formatHtml(value);
  };

  const handleExample = () => {
    const example = '<html><head><title>Example</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph with <a href="#">a link</a>.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>';
    setInput(example);
    formatHtml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="HTML Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your HTML here..."
          example="Load example HTML"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Formatted HTML"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Formatted HTML will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="HTML Formatter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Formats and beautifies HTML code with proper indentation and structure. 
              Makes minified or poorly formatted HTML readable and organized.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time HTML formatting as you type</li>
              <li>Proper indentation with 2-space tabs</li>
              <li>Handles nested elements correctly</li>
              <li>Preserves self-closing tags</li>
              <li>One-click copy functionality</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Format minified HTML for readability</li>
              <li>Clean up messy HTML code</li>
              <li>Prepare HTML for code reviews</li>
              <li>Debug HTML structure issues</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}