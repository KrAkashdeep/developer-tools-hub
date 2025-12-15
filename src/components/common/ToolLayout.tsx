'use client';

import { ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function ToolLayout({ children, className = '' }: ToolLayoutProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
}