'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import CopyButton from './CopyButton';

interface OutputBoxProps {
  title: string;
  value: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  readOnly?: boolean;
}

export default function OutputBox({
  title,
  value,
  placeholder = 'Output will appear here...',
  rows = 10,
  className = '',
  readOnly = true
}: OutputBoxProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="output" className="text-lg font-semibold">
          {title}
        </Label>
        <CopyButton text={value} />
      </div>
      
      <Textarea
        id="output"
        value={value}
        placeholder={placeholder}
        rows={rows}
        readOnly={readOnly}
        className="font-mono text-sm resize-none"
      />
    </div>
  );
}