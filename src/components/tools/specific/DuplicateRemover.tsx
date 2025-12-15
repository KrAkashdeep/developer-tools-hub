import React, { useState } from 'react';
import { ToolPageLayout } from '../ToolPageLayout';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { removeDuplicateLines, removeDuplicateWords } from '@/lib/utils/text';
import { Tool } from '@/lib/types';

interface DuplicateRemoverProps {
  tool: Tool;
}

export function DuplicateRemover({ tool }: DuplicateRemoverProps) {
  const [removalType, setRemovalType] = useState<'lines' | 'words'>('lines');

  const handleProcess = (input: string) => {
    if (!input.trim()) {
      return { output: '' };
    }

    if (removalType === 'lines') {
      const result = removeDuplicateLines(input);
      return {
        output: result.success ? result.result || '' : '',
        error: result.error
      };
    } else {
      const result = removeDuplicateWords(input);
      return {
        output: result.success ? result.result || '' : '',
        error: result.error
      };
    }
  };

  const options = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="removal-type">Removal Type</Label>
        <Select value={removalType} onValueChange={(value: 'lines' | 'words') => setRemovalType(value)}>
          <SelectTrigger id="removal-type" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lines">Remove Duplicate Lines</SelectItem>
            <SelectItem value="words">Remove Duplicate Words</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const placeholder = removalType === 'lines' 
    ? 'Enter text with duplicate lines to remove...'
    : 'Enter text with duplicate words to remove...';

  const outputPlaceholder = removalType === 'lines'
    ? 'Text with unique lines will appear here...'
    : 'Text with unique words will appear here...';

  return (
    <ToolPageLayout
      tool={tool}
      onProcess={handleProcess}
      options={options}
      placeholder={placeholder}
      outputPlaceholder={outputPlaceholder}
    />
  );
}