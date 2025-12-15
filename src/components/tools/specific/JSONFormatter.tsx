import React, { useState } from 'react';
import { ToolPageLayout } from '../ToolPageLayout';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatJson, minifyJson } from '@/lib/utils/formatters';
import { Tool } from '@/lib/types';

interface JSONFormatterProps {
  tool: Tool;
}

export function JSONFormatter({ tool }: JSONFormatterProps) {
  const [indentSize, setIndentSize] = useState('2');
  const [formatType, setFormatType] = useState<'format' | 'minify'>('format');

  const handleProcess = (input: string) => {
    if (!input.trim()) {
      return { output: '' };
    }

    if (formatType === 'minify') {
      const result = minifyJson(input);
      return {
        output: result.success ? result.formatted || '' : '',
        error: result.error
      };
    } else {
      const result = formatJson(input, parseInt(indentSize));
      return {
        output: result.success ? result.formatted || '' : '',
        error: result.error
      };
    }
  };

  const options = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="format-type">Format Type</Label>
          <Select value={formatType} onValueChange={(value: 'format' | 'minify') => setFormatType(value)}>
            <SelectTrigger id="format-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="format">Format (Pretty Print)</SelectItem>
              <SelectItem value="minify">Minify (Compact)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {formatType === 'format' && (
          <div className="space-y-2">
            <Label htmlFor="indent-size">Indent Size</Label>
            <Select value={indentSize} onValueChange={setIndentSize}>
              <SelectTrigger id="indent-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      tool={tool}
      onProcess={handleProcess}
      options={options}
      placeholder="Paste your JSON here..."
      outputPlaceholder="Formatted JSON will appear here..."
    />
  );
}