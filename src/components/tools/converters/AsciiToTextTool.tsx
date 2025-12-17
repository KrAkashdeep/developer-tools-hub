'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function AsciiToTextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(' ');

  const asciiToText = (asciiString: string) => {
    if (!asciiString.trim()) {
      setOutput('');
      return;
    }

    try {
      // Split by delimiter and filter out empty strings
      const asciiCodes = asciiString
        .split(delimiter)
        .map(code => code.trim())
        .filter(code => code !== '');

      let result = '';
      let errors: string[] = [];

      asciiCodes.forEach((code, index) => {
        const num = parseInt(code, 10);
        
        if (isNaN(num)) {
          errors.push(`Invalid number at position ${index + 1}: "${code}"`);
          return;
        }
        
        if (num < 0 || num > 127) {
          errors.push(`ASCII code out of range (0-127) at position ${index + 1}: ${num}`);
          return;
        }
        
        result += String.fromCharCode(num);
      });

      if (errors.length > 0) {
        setOutput(`Errors found:\n${errors.join('\n')}\n\nPartial result: ${result}`);
      } else {
        setOutput(result);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Invalid ASCII format'}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    asciiToText(value);
  };

  const handleExample = () => {
    const example = '72 101 108 108 111 32 87 111 114 108 100 33';
    setInput(example);
    asciiToText(example);
  };

  const commonDelimiters = [
    { name: 'Space', value: ' ' },
    { name: 'Comma', value: ',' },
    { name: 'Semicolon', value: ';' },
    { name: 'Newline', value: '\n' },
    { name: 'Tab', value: '\t' },
  ];

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="ASCII Codes"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter ASCII codes separated by delimiter (e.g., 72 101 108 108 111)..."
          rows={6}
          example="Load example ASCII codes"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Converted Text"
          value={output}
          placeholder="Converted text will appear here..."
          rows={6}
        />
      </ToolLayout>

      {/* Delimiter Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Delimiter Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="delimiter">ASCII Code Delimiter</Label>
            <select
              id="delimiter"
              value={delimiter}
              onChange={(e) => {
                setDelimiter(e.target.value);
                asciiToText(input);
              }}
              className="w-full mt-2 px-3 py-2 border rounded"
            >
              {commonDelimiters.map((delim, index) => (
                <option key={index} value={delim.value}>
                  {delim.name} ({delim.value === '\n' ? '\\n' : delim.value === '\t' ? '\\t' : `"${delim.value}"`})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ASCII Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Common ASCII Codes Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Control Characters</h4>
              <div className="space-y-1 font-mono">
                <div>0 = NULL</div>
                <div>9 = TAB</div>
                <div>10 = LF (Line Feed)</div>
                <div>13 = CR (Carriage Return)</div>
                <div>32 = SPACE</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Numbers</h4>
              <div className="space-y-1 font-mono">
                <div>48-57 = 0-9</div>
                <div>48 = 0</div>
                <div>49 = 1</div>
                <div>50 = 2</div>
                <div>57 = 9</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Uppercase Letters</h4>
              <div className="space-y-1 font-mono">
                <div>65-90 = A-Z</div>
                <div>65 = A</div>
                <div>66 = B</div>
                <div>67 = C</div>
                <div>90 = Z</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Lowercase Letters</h4>
              <div className="space-y-1 font-mono">
                <div>97-122 = a-z</div>
                <div>97 = a</div>
                <div>98 = b</div>
                <div>99 = c</div>
                <div>122 = z</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="ASCII to Text Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is ASCII?</h4>
            <p className="text-sm text-muted-foreground">
              ASCII (American Standard Code for Information Interchange) is a character encoding standard 
              that assigns numeric codes (0-127) to characters including letters, numbers, and symbols.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts ASCII codes to readable text</li>
              <li>Supports multiple delimiters (space, comma, semicolon, etc.)</li>
              <li>Validates ASCII code ranges (0-127)</li>
              <li>Error reporting for invalid codes</li>
              <li>Partial conversion when some codes are invalid</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Input Format:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Enter ASCII codes separated by your chosen delimiter</li>
              <li>Each code must be a number between 0 and 127</li>
              <li>Example: "72 101 108 108 111" converts to "Hello"</li>
              <li>Supports different delimiters for various data formats</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use Cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Decoding ASCII-encoded messages</li>
              <li>Converting numeric data to text</li>
              <li>Educational purposes and learning ASCII</li>
              <li>Data recovery and format conversion</li>
              <li>Programming and debugging</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>ASCII codes 32-126 represent printable characters</li>
              <li>Codes 0-31 are control characters (mostly non-printable)</li>
              <li>Code 127 is the DEL (delete) character</li>
              <li>Use the reference table to understand common codes</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}