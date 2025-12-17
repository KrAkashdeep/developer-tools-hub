'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

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
      <CollapsibleGuide title="Text to ASCII Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Converts text characters to their corresponding ASCII (American Standard Code for Information Interchange) 
              numeric values. Each character is represented by a number from 0 to 127.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">ASCII basics:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>ASCII codes 0-31: Control characters (non-printable)</li>
              <li>ASCII codes 32-126: Printable characters</li>
              <li>ASCII code 32: Space character</li>
              <li>ASCII codes 48-57: Numbers 0-9</li>
              <li>ASCII codes 65-90: Uppercase letters A-Z</li>
              <li>ASCII codes 97-122: Lowercase letters a-z</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common ASCII values:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div>Space: 32</div><div>!: 33</div>
              <div>A: 65</div><div>a: 97</div>
              <div>0: 48</div><div>9: 57</div>
              <div>@: 64</div><div>#: 35</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Character encoding analysis</li>
              <li>Programming and debugging</li>
              <li>Data transmission protocols</li>
              <li>Educational purposes</li>
              <li>Text processing algorithms</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}