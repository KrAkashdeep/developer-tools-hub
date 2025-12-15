import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import * as TablerIcons from '@tabler/icons-react';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    popular?: boolean;
    slug: string;
  };
  variant?: 'default' | 'compact' | 'featured';
}

export function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  // Get the icon component from Tabler Icons
  const IconComponent = (TablerIcons as any)[tool.icon] || TablerIcons.IconTool;

  // Save current state when tool is clicked
  const handleToolClick = () => {
    // Save current scroll position and timestamp
    localStorage.setItem('devtools-scroll-position', window.scrollY.toString());
    localStorage.setItem('devtools-last-visit', Date.now().toString());
    localStorage.setItem('devtools-source-category', tool.category);
  };

  const cardClasses = cn(
    'group transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
    {
      'h-full': variant === 'default',
      'h-auto': variant === 'compact',
      'border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10': variant === 'featured',
    }
  );

  const iconClasses = cn(
    'transition-colors duration-200',
    {
      'size-8 text-primary group-hover:text-primary/80': variant === 'default',
      'size-6 text-primary group-hover:text-primary/80': variant === 'compact',
      'size-10 text-primary group-hover:text-primary/80': variant === 'featured',
    }
  );

  const titleClasses = cn(
    'group-hover:text-primary transition-colors duration-200',
    {
      'text-lg font-semibold': variant === 'default',
      'text-base font-medium': variant === 'compact',
      'text-xl font-bold': variant === 'featured',
    }
  );

  const descriptionClasses = cn(
    'text-muted-foreground',
    {
      'text-sm': variant === 'default' || variant === 'compact',
      'text-base': variant === 'featured',
    }
  );

  return (
    <Link href={`/tools/${tool.slug}`} className="block h-full" onClick={handleToolClick}>
      <Card className={cardClasses}>
        <CardHeader className={cn('pb-3', { 'pb-2': variant === 'compact' })}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className={iconClasses} />
              <div className="flex-1 min-w-0">
                <CardTitle className={titleClasses}>
                  {tool.name}
                </CardTitle>
              </div>
            </div>
            {tool.popular && (
              <Badge variant="secondary" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
        </CardHeader>
        {variant !== 'compact' && (
          <CardContent className="pt-0">
            <CardDescription className={descriptionClasses}>
              {tool.description}
            </CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}