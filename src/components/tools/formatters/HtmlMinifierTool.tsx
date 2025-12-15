'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <Card>
        <CardHeader>
          <CardTitle>HTML Minifier</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Removes unnecessary whitespace and comments from HTML to reduce file size.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}