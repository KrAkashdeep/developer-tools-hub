'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UrlDecodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decodeUrl = (encodedText: string) => {
    if (!encodedText.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const decoded = decodeURIComponent(encodedText.trim());
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Invalid URL encoded string');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    decodeUrl(value);
  };

  const handleExample = () => {
    const example = 'Hello%20World%21%20This%20is%20a%20test%20with%20special%20characters%3A%20%40%23%24%25%5E%26*()';
    setInput(example);
    decodeUrl(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="URL Encoded Text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter URL encoded text to decode..."
          example="Load example encoded text"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Decoded Text"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Decoded text will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>How to use URL Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Converts URL-encoded (percent-encoded) text back to its original format. 
              Decodes %XX sequences back to their corresponding characters.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time URL decoding as you type</li>
              <li>Handles all percent-encoded sequences</li>
              <li>Supports Unicode characters</li>
              <li>Error detection for malformed encoding</li>
              <li>Instant copy to clipboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Decoding URL query parameters</li>
              <li>Reading encoded form data</li>
              <li>Debugging web requests</li>
              <li>Processing API responses</li>
              <li>Analyzing web server logs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Percent encoding format:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>%20 = space character</li>
              <li>%21 = exclamation mark (!)</li>
              <li>%40 = at symbol (@)</li>
              <li>%2B = plus sign (+)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <div>Input: "Hello%20World%21"</div>
              <div>Output: "Hello World!"</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}