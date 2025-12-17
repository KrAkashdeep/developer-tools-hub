'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import OutputBox from '@/components/common/OutputBox';
import { IconRefresh } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function LoremGeneratorTool() {
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
    'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
    'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'ratione'
  ];

  const generateWords = (wordCount: number): string => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = (): string => {
    const wordCount = Math.floor(Math.random() * 10) + 8; // 8-17 words per sentence
    const sentence = generateWords(wordCount);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generateLorem = () => {
    let result = '';
    
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
    }
    
    setOutput(result);
  };

  // Generate initial lorem on component mount
  useState(() => {
    generateLorem();
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Lorem Ipsum Generator Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="type">Generate</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'words' | 'sentences' | 'paragraphs')}
                className="w-full mt-2 px-3 py-2 border rounded"
              >
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="paragraphs">Paragraphs</option>
              </select>
            </div>

            <div>
              <Label htmlFor="count">Count</Label>
              <input
                id="count"
                type="number"
                min="1"
                max={type === 'words' ? 1000 : type === 'sentences' ? 100 : 20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full mt-2 px-3 py-2 border rounded"
              />
            </div>

            <Button onClick={generateLorem} className="flex items-center gap-2">
              <IconRefresh className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      <OutputBox
        title={`Generated Lorem Ipsum (${count} ${type})`}
        value={output}
        rows={15}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setType('words');
                setCount(50);
                setTimeout(generateLorem, 0);
              }}
            >
              50 Words
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setType('words');
                setCount(100);
                setTimeout(generateLorem, 0);
              }}
            >
              100 Words
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setType('sentences');
                setCount(5);
                setTimeout(generateLorem, 0);
              }}
            >
              5 Sentences
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setType('paragraphs');
                setCount(3);
                setTimeout(generateLorem, 0);
              }}
            >
              3 Paragraphs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <CollapsibleGuide title="Lorem Ipsum Generator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What is Lorem Ipsum?</h4>
            <p className="text-sm text-muted-foreground">
              Lorem Ipsum is placeholder text commonly used in the printing and typesetting industry. 
              It's derived from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" 
              (The Extremes of Good and Evil) by Cicero, written in 45 BC.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Why use Lorem Ipsum?</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Focuses attention on design rather than content</li>
              <li>Prevents distraction from readable text</li>
              <li>Industry standard for placeholder text</li>
              <li>Maintains consistent text length and structure</li>
              <li>Avoids copyright issues with real content</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Website mockups and wireframes</li>
              <li>Print design layouts</li>
              <li>Content management system testing</li>
              <li>Typography and font testing</li>
              <li>Template and theme development</li>
              <li>Presentation slides and documents</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use realistic content lengths for your design</li>
              <li>Replace with real content before going live</li>
              <li>Consider using domain-specific placeholder text when appropriate</li>
              <li>Test with both short and long content variations</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}