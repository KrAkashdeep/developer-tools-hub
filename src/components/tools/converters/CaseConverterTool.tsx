'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/common/CopyButton';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function CaseConverterTool() {
  const [input, setInput] = useState('');

  const convertToUpperCase = (text: string) => text.toUpperCase();
  
  const convertToLowerCase = (text: string) => text.toLowerCase();
  
  const convertToTitleCase = (text: string) => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
  
  const convertToSentenceCase = (text: string) => {
    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };
  
  const convertToCamelCase = (text: string) => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  };
  
  const convertToPascalCase = (text: string) => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  };
  
  const convertToSnakeCase = (text: string) => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  };
  
  const convertToKebabCase = (text: string) => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
  };

  const handleExample = () => {
    const example = 'hello world! this is a SAMPLE text for case conversion.';
    setInput(example);
  };

  const conversions = [
    { name: 'UPPER CASE', func: convertToUpperCase, description: 'ALL LETTERS IN UPPERCASE' },
    { name: 'lower case', func: convertToLowerCase, description: 'all letters in lowercase' },
    { name: 'Title Case', func: convertToTitleCase, description: 'First Letter Of Each Word Capitalized' },
    { name: 'Sentence case', func: convertToSentenceCase, description: 'First letter of each sentence capitalized' },
    { name: 'camelCase', func: convertToCamelCase, description: 'firstWordLowercaseRestCapitalized' },
    { name: 'PascalCase', func: convertToPascalCase, description: 'FirstLetterOfEachWordCapitalized' },
    { name: 'snake_case', func: convertToSnakeCase, description: 'words_separated_by_underscores' },
    { name: 'kebab-case', func: convertToKebabCase, description: 'words-separated-by-hyphens' },
  ];

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text to Convert"
          value={input}
          onChange={setInput}
          placeholder="Enter text to convert case..."
          rows={8}
          example="Load example text"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Converted Cases</h3>
          
          <div className="space-y-3">
            {conversions.map((conversion, index) => {
              const convertedText = input ? conversion.func(input) : '';
              
              return (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{conversion.name}</h4>
                        <p className="text-xs text-muted-foreground">{conversion.description}</p>
                      </div>
                      <CopyButton text={convertedText} />
                    </div>
                    <div className="p-3 bg-muted rounded font-mono text-sm min-h-[60px] break-words">
                      {convertedText || 'Converted text will appear here...'}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="Case Converter Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Available conversions:</h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>UPPER CASE:</strong> All letters capitalized
                </div>
                <div>
                  <strong>lower case:</strong> All letters lowercase
                </div>
                <div>
                  <strong>Title Case:</strong> First letter of each word capitalized
                </div>
                <div>
                  <strong>Sentence case:</strong> First letter of sentences capitalized
                </div>
                <div>
                  <strong>camelCase:</strong> First word lowercase, rest capitalized (no spaces)
                </div>
                <div>
                  <strong>PascalCase:</strong> All words capitalized (no spaces)
                </div>
                <div>
                  <strong>snake_case:</strong> Lowercase with underscores
                </div>
                <div>
                  <strong>kebab-case:</strong> Lowercase with hyphens
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Programming:</strong> Variable naming (camelCase, snake_case)</li>
              <li><strong>URLs:</strong> SEO-friendly slugs (kebab-case)</li>
              <li><strong>Documentation:</strong> Proper title formatting</li>
              <li><strong>Data processing:</strong> Standardizing text formats</li>
              <li><strong>Content creation:</strong> Consistent capitalization</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use camelCase for JavaScript variables and functions</li>
              <li>Use PascalCase for class names and components</li>
              <li>Use kebab-case for CSS classes and file names</li>
              <li>Use snake_case for database columns and Python variables</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}