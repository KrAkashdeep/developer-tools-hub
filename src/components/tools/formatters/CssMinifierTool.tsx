'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CssMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyCss = (css: string) => {
    if (!css.trim()) {
      setOutput('');
      setStats({ original: 0, minified: 0, saved: 0 });
      return;
    }

    try {
      let minified = css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around specific characters
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*>\s*/g, '>')
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*~\s*/g, '~')
        // Remove trailing semicolon before }
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();

      setOutput(minified);
      
      const originalSize = css.length;
      const minifiedSize = minified.length;
      const savedPercent = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;
      
      setStats({
        original: originalSize,
        minified: minifiedSize,
        saved: savedPercent
      });
    } catch (err) {
      setOutput('Error minifying CSS');
      setStats({ original: 0, minified: 0, saved: 0 });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    minifyCss(value);
  };

  const handleExample = () => {
    const example = `/* Main styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: #333333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.button {
  display: inline-block;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.button:hover {
  background-color: #0056b3;
}`;
    setInput(example);
    minifyCss(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="CSS Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your CSS here..."
          example="Load example CSS"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <OutputBox
            title="Minified CSS"
            value={output}
            placeholder="Minified CSS will appear here..."
          />
          
          {stats.original > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">
                Original: {stats.original} bytes
              </Badge>
              <Badge variant="outline">
                Minified: {stats.minified} bytes
              </Badge>
              <Badge variant="secondary">
                Saved: {stats.saved}%
              </Badge>
            </div>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>How to use CSS Minifier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Removes unnecessary whitespace, comments, and formatting from CSS code 
              to reduce file size while maintaining functionality.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time CSS minification</li>
              <li>Removes comments and unnecessary whitespace</li>
              <li>Shows size reduction statistics</li>
              <li>Preserves CSS functionality</li>
              <li>One-click copy functionality</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Reduce CSS file size for production</li>
              <li>Optimize website loading speed</li>
              <li>Prepare CSS for deployment</li>
              <li>Save bandwidth in web applications</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}