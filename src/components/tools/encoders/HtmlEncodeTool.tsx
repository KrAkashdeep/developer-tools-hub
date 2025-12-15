'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HtmlEncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeHtml = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    const encoded = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    setOutput(encoded);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    encodeHtml(value);
  };

  const handleExample = () => {
    const example = '<div class="example">Hello & "welcome" to HTML encoding!</div>';
    setInput(example);
    encodeHtml(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Encode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to HTML encode..."
          example="Load example text"
          onExample={handleExample}
        />
        <OutputBox
          title="HTML Encoded"
          value={output}
          placeholder="HTML encoded text will appear here..."
        />
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>HTML Encoder</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Encodes special characters to HTML entities for safe display in web pages.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}