'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RemoveDuplicatesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });

  const removeDuplicates = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      setStats({ original: 0, unique: 0, removed: 0 });
      return;
    }

    const lines = text.split('\n');
    const uniqueLines = [...new Set(lines)];
    
    setOutput(uniqueLines.join('\n'));
    setStats({
      original: lines.length,
      unique: uniqueLines.length,
      removed: lines.length - uniqueLines.length
    });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    removeDuplicates(value);
  };

  const handleExample = () => {
    const example = `apple\nbanana\napple\ncherry\nbanana\ndate\napple\nfig`;
    setInput(example);
    removeDuplicates(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Text with Duplicates"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text with duplicate lines..."
          example="Load example text"
          onExample={handleExample}
        />
        <div className="space-y-4">
          <OutputBox
            title="Unique Lines"
            value={output}
            placeholder="Unique lines will appear here..."
          />
          {stats.original > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Original: {stats.original} lines</Badge>
              <Badge variant="outline">Unique: {stats.unique} lines</Badge>
              <Badge variant="secondary">Removed: {stats.removed} duplicates</Badge>
            </div>
          )}
        </div>
      </ToolLayout>
      <Card>
        <CardHeader>
          <CardTitle>Remove Duplicate Lines</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Removes duplicate lines from text while preserving the original order.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}