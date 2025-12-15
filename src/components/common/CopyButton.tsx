'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconCopy, IconCheck } from '@tabler/icons-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={!text}
      className={`flex items-center gap-2 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground ${className}`}
    >
      {copied ? (
        <>
          <IconCheck className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <IconCopy className="h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
}