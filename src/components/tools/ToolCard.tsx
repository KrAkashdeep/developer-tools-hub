'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tool } from '@/lib/data/tools';
import * as TablerIcons from '@tabler/icons-react';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export default function ToolCard({ tool, className = '' }: ToolCardProps) {
  // Get the icon component dynamically
  const IconComponent = (TablerIcons as any)[tool.icon] || TablerIcons.IconTool;

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className={`h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              {tool.popular && (
                <Badge variant="secondary" className="mt-1">
                  Popular
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {tool.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}