'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

export default function SlugGeneratorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState('-');

  const generateSlug = (text: string, sep: string = '-') => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, sep)
      .replace(new RegExp(`${sep}+`, 'g'), sep)
      .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '');

    setOutput(slug);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    generateSlug(value, separator);
  };

  const handleSeparatorChange = (newSep: string) => {
    setSeparator(newSep);
    generateSlug(input, newSep);
  };

  const handleExample = () => {
    const example = 'How to Create SEO-Friendly URLs in 2025!';
    setInput(example);
    generateSlug(example, separator);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Slug Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={separator === '-' ? 'default' : 'outline'}
              onClick={() => handleSeparatorChange('-')}
            >
              Hyphen (-)
            </Button>
            <Button
              variant={separator === '_' ? 'default' : 'outline'}
              onClick={() => handleSeparatorChange('_')}
            >
              Underscore (_)
            </Button>
          </div>
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="Text to Convert"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to convert to slug..."
          type="input"
          example="Load example text"
          onExample={handleExample}
        />
        <OutputBox
          title="Generated Slug"
          value={output}
          placeholder="URL-friendly slug will appear here..."
        />
      </ToolLayout>

      <CollapsibleGuide title="Slug Generator Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Converts text to URL-friendly slugs by removing special characters, converting to lowercase, 
              and replacing spaces with hyphens or underscores.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Converts to lowercase automatically</li>
              <li>Removes special characters and punctuation</li>
              <li>Replaces spaces with hyphens or underscores</li>
              <li>Removes multiple consecutive separators</li>
              <li>Trims separators from start and end</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Creating SEO-friendly URLs</li>
              <li>Blog post and article URLs</li>
              <li>File and folder naming</li>
              <li>Database identifiers</li>
              <li>API endpoint paths</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Best practices:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use hyphens (-) for better SEO</li>
              <li>Keep slugs short and descriptive</li>
              <li>Avoid stop words when possible</li>
              <li>Use consistent separator throughout site</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}