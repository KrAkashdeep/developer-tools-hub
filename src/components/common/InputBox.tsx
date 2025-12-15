'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconTrash, IconBulb } from '@tabler/icons-react';

interface InputBoxProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'textarea' | 'input';
  rows?: number;
  example?: string;
  onExample?: () => void;
  className?: string;
}

export default function InputBox({
  title,
  value,
  onChange,
  placeholder = 'Enter your input here...',
  type = 'textarea',
  rows = 10,
  example,
  onExample,
  className = ''
}: InputBoxProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Label htmlFor="input" className="text-base sm:text-lg font-semibold">
          {title}
        </Label>
        <div className="flex gap-2">
          {example && onExample && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExample}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <IconBulb className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Example</span>
              <span className="sm:hidden">Ex</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <IconTrash className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Clear</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
      </div>
      
      {type === 'textarea' ? (
        <Textarea
          id="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-xs sm:text-sm resize-none"
        />
      ) : (
        <Input
          id="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-xs sm:text-sm"
        />
      )}
    </div>
  );
}