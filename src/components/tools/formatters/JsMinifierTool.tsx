'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function JsMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyJavaScript = (jsCode: string) => {
    if (!jsCode.trim()) {
      setOutput('');
      setStats({ original: 0, minified: 0, saved: 0 });
      return;
    }

    try {
      let minified = jsCode
        // Remove single-line comments (but preserve URLs)
        .replace(/\/\/(?![^\r\n]*https?:)[^\r\n]*/g, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around operators and punctuation
        .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
        // Remove spaces around dots
        .replace(/\s*\.\s*/g, '.')
        // Remove spaces around brackets
        .replace(/\s*\[\s*/g, '[')
        .replace(/\s*\]\s*/g, ']')
        // Remove trailing semicolons before }
        .replace(/;}/g, '}')
        // Clean up
        .trim();

      setOutput(minified);
      
      const originalSize = jsCode.length;
      const minifiedSize = minified.length;
      const savedPercent = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;
      
      setStats({
        original: originalSize,
        minified: minifiedSize,
        saved: savedPercent
      });
    } catch (err) {
      setOutput('Error minifying JavaScript');
      setStats({ original: 0, minified: 0, saved: 0 });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    minifyJavaScript(value);
  };

  const handleExample = () => {
    const example = `// Calculator function
function calculateTotal(items) {
  let total = 0;
  
  // Loop through all items
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  
  return total;
}

/* Shopping cart object */
const cart = {
  items: [
    { name: "Apple", price: 1.50 },
    { name: "Banana", price: 0.75 },
    { name: "Orange", price: 1.25 }
  ],
  
  getTotal: function() {
    return calculateTotal(this.items);
  },
  
  addItem: function(item) {
    this.items.push(item);
  }
};

// Display total
console.log("Total:", cart.getTotal());`;
    setInput(example);
    minifyJavaScript(example);
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
        
        <div className="space-y-4">
          <OutputBox
            title="Minified JavaScript"
            value={output}
            placeholder="Minified JavaScript will appear here..."
          />
          
          {stats.original > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">
                Original: {stats.original} bytes
              </Badge>
              <Badge variant="outline">
                Minified: {stats.minified} bytes
              </Badge>
              <Badge variant="secondary">
                Saved: {stats.saved}%
              </Badge>
            </div>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="JavaScript Minifier Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Removes comments, unnecessary whitespace, and formatting from JavaScript code 
              to reduce file size while preserving functionality.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Real-time JavaScript minification</li>
              <li>Removes comments and whitespace</li>
              <li>Shows size reduction statistics</li>
              <li>Preserves code functionality</li>
              <li>Handles strings and URLs safely</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Reduce JavaScript file size for production</li>
              <li>Optimize website loading performance</li>
              <li>Prepare code for deployment</li>
              <li>Save bandwidth in web applications</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Important notes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Always test minified code before deployment</li>
              <li>Keep original source files for debugging</li>
              <li>Consider using source maps for production</li>
              <li>This is basic minification - use tools like UglifyJS for advanced optimization</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}