'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CssFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatCss = (cssString: string) => {
    if (!cssString.trim()) {
      setOutput('');
      return;
    }

    try {
      let formatted = cssString
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/}\s*/g, '\n}\n\n')
        .replace(/,\s*/g, ',\n')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      setOutput(formatted);
    } catch (err) {
      setOutput('Error formatting CSS');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    formatCss(value);
  };

  const handleExample = () => {
    const example = 'body{margin:0;padding:0;font-family:Arial,sans-serif}.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:#333;color:white;padding:10px}';
    setInput(example);
    formatCss(example);
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
        <OutputBox
          title="Formatted CSS"
          value={output}
          placeholder="Formatted CSS will appear here..."
        />
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>CSS Formatter</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Formats and beautifies CSS code with proper indentation and spacing.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}