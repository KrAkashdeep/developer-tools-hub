'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function Base64EncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeBase64 = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setOutput(encoded);
    } catch (err) {
      setOutput('Error: Unable to encode text');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    encodeBase64(value);
  };

  const handleExample = () => {
    const example = 'Hello, World! This is a sample text for Base64 encoding.';
    setInput(example);
    encodeBase64(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Encode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to encode to Base64..."
          example="Load example text"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Base64 Encoded"
          value={output}
          placeholder="Base64 encoded text will appear here..."
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Base64 Encoder Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Converts text or binary data into Base64 encoding, which represents binary data 
              in ASCII string format using a radix-64 representation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time Base64 encoding</li>
              <li>Supports UTF-8 characters</li>
              <li>Handles special characters and emojis</li>
              <li>Instant copy to clipboard</li>
              <li>No character limit</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Encoding data for URLs and HTTP headers</li>
              <li>Embedding images in HTML/CSS (data URLs)</li>
              <li>API authentication tokens</li>
              <li>Email attachments (MIME encoding)</li>
              <li>Storing binary data in text format</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Example:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <div>Input: "Hello World"</div>
              <div>Output: "SGVsbG8gV29ybGQ="</div>
            </div>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}