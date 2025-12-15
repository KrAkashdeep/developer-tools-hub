import React, { useState } from 'react';
import { ToolPageLayout } from '../ToolPageLayout';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { encodeBase64, decodeBase64 } from '@/lib/utils/encoders';
import { Tool } from '@/lib/types';

interface Base64EncoderDecoderProps {
  tool: Tool;
}

export function Base64EncoderDecoder({ tool }: Base64EncoderDecoderProps) {
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');

  const handleProcess = (input: string) => {
    if (!input.trim()) {
      return { output: '' };
    }

    if (operation === 'encode') {
      const result = encodeBase64(input);
      return {
        output: result.success ? result.encoded || '' : '',
        error: result.error
      };
    } else {
      const result = decodeBase64(input);
      return {
        output: result.success ? result.decoded || '' : '',
        error: result.error
      };
    }
  };

  const options = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="operation">Operation</Label>
        <Select value={operation} onValueChange={(value: 'encode' | 'decode') => setOperation(value)}>
          <SelectTrigger id="operation" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="encode">Encode to Base64</SelectItem>
            <SelectItem value="decode">Decode from Base64</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const placeholder = operation === 'encode' 
    ? 'Enter text to encode to Base64...'
    : 'Enter Base64 string to decode...';

  const outputPlaceholder = operation === 'encode'
    ? 'Base64 encoded text will appear here...'
    : 'Decoded text will appear here...';

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