'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

      <Card>
        <CardHeader>
          <CardTitle>Slug Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Converts text to URL-friendly slugs by removing special characters, converting to lowercase, and replacing spaces with hyphens or underscores.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}