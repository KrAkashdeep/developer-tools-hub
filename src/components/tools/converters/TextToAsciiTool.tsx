'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TextToAsciiTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const textToAscii = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    const asciiValues = text
      .split('')
      .map(char => char.charCodeAt(0))
      .join(' ');

    setOutput(asciiValues);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    textToAscii(value);
  };

  const handleExample = () => {
    const example = 'Hello World!';
    setInput(example);
    textToAscii(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to convert to ASCII..."
          example="Load example text"
          onExample={handleExample}
        />
        <OutputBox
          title="ASCII Codes"
          value={output}
          placeholder="ASCII codes will appear here..."
        />
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>Text to ASCII Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Converts text characters to their ASCII code values.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}