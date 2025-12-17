'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function HtmlMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyHtml = (html: string) => {
    if (!html.trim()) {
      setOutput('');
      setStats({ original: 0, minified: 0, saved: 0 });
      return;
    }

    const minified = html
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();

    setOutput(minified);
    
    const originalSize = html.length;
    const minifiedSize = minified.length;
    const savedPercent = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;
    
    setStats({
      original: originalSize,
      minified: minifiedSize,
      saved: savedPercent
    });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    minifyHtml(value);
  };

  const handleExample = () => {
    const example = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Example</title>
  </head>
  <body>
    <div class="container">
      <h1>Hello World</h1>
      <p>This is a paragraph.</p>
    </div>
  </body>
</html>`;
    setInput(example);
    minifyHtml(example);
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
        <div className="space-y-4">
          <OutputBox
            title="Minified HTML"
            value={output}
            placeholder="Minified HTML will appear here..."
          />
          {stats.original > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Original: {stats.original} bytes</Badge>
              <Badge variant="outline">Minified: {stats.minified} bytes</Badge>
              <Badge variant="secondary">Saved: {stats.saved}%</Badge>
            </div>
          )}
        </div>
      </ToolLayout>
      <CollapsibleGuide title="HTML Minifier Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Removes unnecessary whitespace, comments, and formatting from HTML to reduce file size and improve loading performance.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Removes extra whitespace and line breaks</li>
              <li>Strips HTML comments</li>
              <li>Preserves functionality while reducing size</li>
              <li>Shows compression statistics</li>
              <li>Real-time minification as you type</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Optimize HTML for production websites</li>
              <li>Reduce bandwidth usage</li>
              <li>Improve page loading speed</li>
              <li>Prepare HTML for deployment</li>
              <li>Email template optimization</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}