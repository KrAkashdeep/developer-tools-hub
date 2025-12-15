'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HexToRgbTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const hexToRgb = (hex: string) => {
    if (!hex.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // Remove # if present
      const cleanHex = hex.replace('#', '');
      
      // Validate hex format
      if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        setError('Invalid hex color format');
        setOutput('');
        return;
      }

      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);

      const result = `RGB: rgb(${r}, ${g}, ${b})\nRed: ${r}\nGreen: ${g}\nBlue: ${b}`;
      setOutput(result);
      setError('');
    } catch (err) {
      setError('Error converting hex to RGB');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    hexToRgb(value);
  };

  const handleExample = () => {
    const example = '#3b82f6';
    setInput(example);
    hexToRgb(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="HEX Color"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter hex color (e.g., #3b82f6)..."
          type="input"
          example="Load example hex"
          onExample={handleExample}
        />
        <OutputBox
          title="RGB Values"
          value={output}
          placeholder={error ? `Error: ${error}` : 'RGB values will appear here...'}
        />
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>HEX to RGB Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Converts hexadecimal color codes to RGB values.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}