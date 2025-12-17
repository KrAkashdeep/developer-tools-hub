'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function JsFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJavaScript = (jsCode: string) => {
    if (!jsCode.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // Basic JavaScript formatting
      let formatted = jsCode
        // Add line breaks after semicolons (but not in strings)
        .replace(/;(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g, ';\n')
        // Add line breaks after opening braces
        .replace(/{(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g, '{\n')
        // Add line breaks before closing braces
        .replace(/}(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/g, '\n}')
        // Add line breaks after commas in object/array literals
        .replace(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)(?![^{]*})/g, ',\n')
        // Clean up multiple line breaks
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Add proper indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentSize = 2;
      
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';

        // Decrease indent for closing braces
        if (trimmedLine.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmedLine;

        // Increase indent for opening braces
        if (trimmedLine.endsWith('{')) {
          indentLevel++;
        }

        return indentedLine;
      });

      setOutput(formattedLines.join('\n'));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error formatting JavaScript');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    formatJavaScript(value);
  };

  const handleExample = () => {
    const example = `function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){total+=items[i].price;}return total;}const cart={items:[{name:"Apple",price:1.50},{name:"Banana",price:0.75}],getTotal:function(){return calculateTotal(this.items);}}; console.log("Total:",cart.getTotal());`;
    setInput(example);
    formatJavaScript(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="JavaScript Input"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your JavaScript code here..."
          example="Load example JavaScript"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Formatted JavaScript"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Formatted JavaScript will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="JavaScript Formatter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Formats and beautifies JavaScript code with proper indentation, line breaks, 
              and spacing to improve readability and maintainability.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time JavaScript formatting</li>
              <li>Proper indentation with 2-space tabs</li>
              <li>Handles functions, objects, and arrays</li>
              <li>Preserves string literals</li>
              <li>One-click copy functionality</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Format minified JavaScript for readability</li>
              <li>Clean up messy or compressed code</li>
              <li>Prepare code for code reviews</li>
              <li>Debug and understand complex JavaScript</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Works best with syntactically correct JavaScript</li>
              <li>Use for formatting minified library code</li>
              <li>Great for cleaning up generated code</li>
              <li>Helps identify code structure and flow</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}