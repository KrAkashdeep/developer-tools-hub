'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

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
      <CollapsibleGuide title="Remove Duplicate Lines Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it does:</h4>
            <p className="text-sm text-muted-foreground">
              Removes duplicate lines from text while preserving the original order. 
              Shows statistics about how many duplicates were removed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Preserves original line order</li>
              <li>Case-sensitive duplicate detection</li>
              <li>Shows removal statistics</li>
              <li>Handles empty lines</li>
              <li>Works with any text format</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Clean up mailing lists</li>
              <li>Remove duplicate entries from data</li>
              <li>Deduplicate log files</li>
              <li>Clean up word lists</li>
              <li>Process CSV data</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Note:</h4>
            <p className="text-sm text-muted-foreground">
              Comparison is exact and case-sensitive. "Apple" and "apple" are treated as different lines.
            </p>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}