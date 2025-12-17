'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function MorseEncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Morse code mapping
  const morseCode: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
  };

  const encodeToMorse = (text: string) => {
    if (!text) {
      setOutput('');
      return;
    }

    const encoded = text
      .toUpperCase()
      .split('')
      .map(char => morseCode[char] || char)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    setOutput(encoded);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    encodeToMorse(value);
  };

  const handleExample = () => {
    const example = 'Hello World! SOS 123';
    setInput(example);
    encodeToMorse(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Encode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to convert to Morse code..."
          example="Load example text"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Morse Code"
          value={output}
          placeholder="Morse code will appear here..."
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Morse Code Encoder Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Converts text to Morse code using dots (.) and dashes (-). 
              Spaces between words are represented by forward slashes (/).
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Morse code basics:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Dot (.) = short signal</li>
              <li>Dash (-) = long signal</li>
              <li>Space = separator between letters</li>
              <li>Forward slash (/) = separator between words</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common Morse patterns:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div>A: .-</div><div>B: -...</div>
              <div>C: -.-.</div><div>D: -..</div>
              <div>E: .</div><div>F: ..-.</div>
              <div>S: ...</div><div>O: ---</div>
              <div>SOS: ... --- ...</div><div>0: -----</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Amateur radio communication</li>
              <li>Emergency signaling</li>
              <li>Educational purposes</li>
              <li>Puzzle and game creation</li>
              <li>Historical communication methods</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}