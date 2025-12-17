'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function MorseDecodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Reverse morse code mapping
  const morseToText: { [key: string]: string } = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
    '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
    '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
    '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
    '---..': '8', '----.': '9', '.-.-.-': '.', '--..--': ',', '..--..': '?',
    '.----.': "'", '-.-.--': '!', '-..-.': '/', '-.--.': '(', '-.--.-': ')',
    '.-...': '&', '---...': ':', '-.-.-.': ';', '-...-': '=', '.-.-.': '+',
    '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-': '@',
    '/': ' '
  };

  const decodeFromMorse = (morse: string) => {
    if (!morse.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const decoded = morse
        .trim()
        .split(' ')
        .map(code => {
          if (code === '') return '';
          return morseToText[code] || `[${code}]`;
        })
        .join('');

      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Error decoding Morse code');
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    decodeFromMorse(value);
  };

  const handleExample = () => {
    const example = '.... . .-.. .-.. --- / .-- --- .-. .-.. -.. -.-.-- / ... --- ... / .---- ..--- ...--';
    setInput(example);
    decodeFromMorse(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Morse Code to Decode"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Morse code to decode (use spaces between letters, / for word breaks)..."
          example="Load example Morse code"
          onExample={handleExample}
        />
        
        <OutputBox
          title="Decoded Text"
          value={output}
          placeholder={error ? `Error: ${error}` : 'Decoded text will appear here...'}
        />
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Morse Code Decoder Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Converts Morse code back to readable text. Recognizes dots (.), dashes (-), 
              and forward slashes (/) for word separation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Input format:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use dots (.) and dashes (-) for Morse code</li>
              <li>Separate letters with spaces</li>
              <li>Use forward slash (/) to separate words</li>
              <li>Example: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Supported characters:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>All letters A-Z</li>
              <li>Numbers 0-9</li>
              <li>Common punctuation (. , ? ' ! / ( ) & : ; = + - _ " $ @)</li>
              <li>Unknown codes will be shown in brackets [code]</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Make sure to use spaces between Morse letters</li>
              <li>Use consistent spacing for best results</li>
              <li>Check for typos in dots and dashes</li>
              <li>SOS in Morse: ... --- ...</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}