'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Base64DecodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decodeBase64 = (base64String: string) => {
    if (!base64String.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(base64String.trim())));
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Invalid Base64 string');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    decodeBase64(value);
  };

  const handleExample = () => {
    const example = 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=';
    setInput(example);
    decodeBase64(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Base64 to Decode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Base64 encoded text to decode..."
          example="Load example Base64"
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
          <CardTitle>How to use Base64 Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <CardDescription>
              Converts Base64 encoded strings back to their original text format. 
              Base64 is commonly used to encode binary data for transmission over text-based protocols.
            </CardDescription>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time Base64 decoding</li>
              <li>Supports UTF-8 characters</li>
              <li>Error detection for invalid Base64</li>
              <li>Handles padding characters (=)</li>
              <li>Instant copy to clipboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Decoding API responses and tokens</li>
              <li>Reading encoded email content</li>
              <li>Extracting data from data URLs</li>
              <li>Debugging encoded parameters</li>
              <li>Converting encoded configuration data</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Valid Base64 format:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Contains only A-Z, a-z, 0-9, +, / characters</li>
              <li>May end with = or == for padding</li>
              <li>Length must be multiple of 4 (with padding)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <div>Input: "SGVsbG8gV29ybGQ="</div>
              <div>Output: "Hello World"</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}