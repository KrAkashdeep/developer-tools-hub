'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

type ReverseMode = 'characters' | 'words' | 'lines';

export default function ReverseTextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ReverseMode>('characters');

  const reverseText = (text: string, reverseMode: ReverseMode) => {
    if (!text) {
      setOutput('');
      return;
    }

    let result = '';

    switch (reverseMode) {
      case 'characters':
        // Reverse all characters
        result = text.split('').reverse().join('');
        break;
        
      case 'words':
        // Reverse word order while preserving line breaks
        result = text
          .split('\n')
          .map(line => 
            line.split(/(\s+)/)
              .filter(part => part.trim() !== '')
              .reverse()
              .join(' ')
              .trim()
          )
          .join('\n');
        break;
        
      case 'lines':
        // Reverse line order
        result = text.split('\n').reverse().join('\n');
        break;
    }

    setOutput(result);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    reverseText(value, mode);
  };

  const handleModeChange = (newMode: ReverseMode) => {
    setMode(newMode);
    reverseText(input, newMode);
  };

  const handleExample = () => {
    const example = `Hello World!
This is line two.
And this is the third line.
Final line here.`;
    setInput(example);
    reverseText(example, mode);
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'characters':
        return 'Reverses all characters in the text';
      case 'words':
        return 'Reverses the order of words in each line';
      case 'lines':
        return 'Reverses the order of lines';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reverse Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={mode === 'characters' ? 'default' : 'outline'}
              onClick={() => handleModeChange('characters')}
            >
              Characters
            </Button>
            <Button
              variant={mode === 'words' ? 'default' : 'outline'}
              onClick={() => handleModeChange('words')}
            >
              Words
            </Button>
            <Button
              variant={mode === 'lines' ? 'default' : 'outline'}
              onClick={() => handleModeChange('lines')}
            >
              Lines
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{getModeDescription()}</p>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Text to Reverse"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to reverse..."
          rows={8}
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Reversed Text</h3>
            <Badge variant="outline">
              {mode === 'characters' ? 'Characters' : 
               mode === 'words' ? 'Words' : 'Lines'}
            </Badge>
          </div>
          <OutputBox
            title="Result"
            value={output}
            placeholder="Reversed text will appear here..."
            rows={8}
          />
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Reverse Text Tool Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Reverse modes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Characters:</strong> Reverses every character in the entire text</li>
              <li><strong>Words:</strong> Reverses the order of words within each line</li>
              <li><strong>Lines:</strong> Reverses the order of lines in the text</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Examples:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Original:</strong> "Hello World"
              </div>
              <div>
                <strong>Characters:</strong> "dlroW olleH"
              </div>
              <div>
                <strong>Words:</strong> "World Hello"
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Create mirror text effects</li>
              <li>Reverse word order for different reading patterns</li>
              <li>Reorder lines in lists or data</li>
              <li>Text puzzles and games</li>
              <li>Data processing and transformation</li>
              <li>Creative writing and text art</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Character reversal works well for creating mirror text</li>
              <li>Word reversal maintains readability while changing order</li>
              <li>Line reversal is useful for reordering lists</li>
              <li>Try different modes to see which works best for your needs</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}