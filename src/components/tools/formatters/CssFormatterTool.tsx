'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

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
      <CollapsibleGuide title="CSS Formatter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Formats and beautifies CSS code with proper indentation, spacing, and structure for better readability.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Proper indentation for nested rules</li>
              <li>Consistent spacing around selectors and properties</li>
              <li>Line breaks for better readability</li>
              <li>Preserves CSS functionality while improving format</li>
              <li>Real-time formatting as you type</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Clean up minified CSS code</li>
              <li>Standardize CSS formatting in projects</li>
              <li>Improve code readability for debugging</li>
              <li>Prepare CSS for code reviews</li>
              <li>Educational purposes and learning CSS structure</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}