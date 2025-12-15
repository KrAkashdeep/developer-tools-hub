'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UrlEncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeUrl = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    try {
      const encoded = encodeURIComponent(text);
      setOutput(encoded);
    } catch (err) {
      setOutput('Error: Unable to encode text');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    encodeUrl(value);
  };

  const handleExample = () => {
    const example = 'Hello World! This is a test with special characters: @#$%^&*()';
    setInput(example);
    encodeUrl(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Encode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to URL encode..."
          example="Load example text"
          onExample={handleExample}
        />
        
        <OutputBox
          title="URL Encoded"
          value={output}
          placeholder="URL encoded text will appear here..."
        />
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>How to use URL Encoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Converts text into a URL-safe format by replacing special characters with percent-encoded values. 
              This is essential for passing data through URLs.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time URL encoding as you type</li>
              <li>Handles all special characters and Unicode</li>
              <li>Follows RFC 3986 standard</li>
              <li>Instant copy to clipboard</li>
              <li>No character limit</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Encoding query parameters for URLs</li>
              <li>Preparing data for GET requests</li>
              <li>Encoding form data</li>
              <li>Creating safe URLs with user input</li>
              <li>API parameter encoding</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <div>Input: "Hello World!"</div>
              <div>Output: "Hello%20World%21"</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}