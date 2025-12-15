'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JsonMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setOutput('');
      setError('');
      setStats({ original: 0, minified: 0, saved: 0 });
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      
      const originalSize = jsonString.length;
      const minifiedSize = minified.length;
      const savedBytes = originalSize - minifiedSize;
      const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
      
      setStats({
        original: originalSize,
        minified: minifiedSize,
        saved: savedPercent
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
      setStats({ original: 0, minified: 0, saved: 0 });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    minifyJson(value);
  };

  const handleExample = () => {
    const example = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": [
    "reading",
    "swimming",
    "coding"
  ],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  }
}`;
    setInput(example);
    minifyJson(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JSON Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your formatted JSON here..."
          example="Load example JSON"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <OutputBox
            title="Minified JSON"
            value={output}
            placeholder={error ? `Error: ${error}` : 'Minified JSON will appear here...'}
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
          <CardTitle>How to use JSON Minifier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Removes all unnecessary whitespace, line breaks, and formatting from JSON data 
              to reduce file size while maintaining the same data structure.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time JSON minification</li>
              <li>Shows size reduction statistics</li>
              <li>Validates JSON syntax</li>
              <li>Preserves data integrity</li>
              <li>One-click copy functionality</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Reduce JSON file size for web applications</li>
              <li>Optimize API responses</li>
              <li>Prepare JSON for production deployment</li>
              <li>Save bandwidth in data transmission</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}