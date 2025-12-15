import React from 'react';
import { ToolPageLayout } from '../ToolPageLayout';
import { generateSlug } from '@/lib/utils/text';
import { Tool } from '@/lib/types';

interface SlugGeneratorProps {
  tool: Tool;
}

export function SlugGenerator({ tool }: SlugGeneratorProps) {
  const handleProcess = (input: string) => {
    if (!input.trim()) {
      return { output: '' };
    }

    const result = generateSlug(input);
    return {
      output: result.success ? result.result || '' : '',
      error: result.error
    };
  };

  return (
    <ToolPageLayout
      tool={tool}
      onProcess={handleProcess}
      placeholder="Enter text to convert to URL-friendly slug..."
      outputPlaceholder="URL-friendly slug will appear here..."
    />
  );
}