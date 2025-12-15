'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    formatJson(value);
  };

  const handleExample = () => {
    const example = '{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","swimming","coding"],"address":{"street":"123 Main St","zipCode":"10001"}}';
    setInput(example);
    formatJson(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JSON Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your JSON here..."
          example="Load example JSON"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Formatted JSON"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Formatted JSON will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>How to use JSON Formatter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Formats and beautifies JSON data with proper indentation and structure. 
              Makes minified JSON readable and validates JSON syntax.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time JSON formatting as you type</li>
              <li>Syntax validation with error messages</li>
              <li>Proper indentation (2 spaces)</li>
              <li>Handles nested objects and arrays</li>
              <li>Copy formatted output with one click</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Paste minified JSON to make it readable</li>
              <li>Use this to validate JSON before using in APIs</li>
              <li>Great for debugging JSON responses</li>
              <li>Works with any valid JSON structure</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}