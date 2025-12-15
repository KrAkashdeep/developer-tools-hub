import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as TablerIcons from '@tabler/icons-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: string;
    slug: string;
    toolCount: number;
    color: string;
  };
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  // Get the icon component from Tabler Icons
  const IconComponent = (TablerIcons as any)[`Icon${category.icon.charAt(0).toUpperCase() + category.icon.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`] || TablerIcons.IconCategory;

  // Color mapping for category themes
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50 hover:border-blue-300/70 text-blue-600',
    green: 'from-green-500/10 to-green-600/5 border-green-200/50 hover:border-green-300/70 text-green-600',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-200/50 hover:border-purple-300/70 text-purple-600',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-200/50 hover:border-orange-300/70 text-orange-600',
    pink: 'from-pink-500/10 to-pink-600/5 border-pink-200/50 hover:border-pink-300/70 text-pink-600',
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-200/50 hover:border-cyan-300/70 text-cyan-600',
    yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-200/50 hover:border-yellow-300/70 text-yellow-600',
    red: 'from-red-500/10 to-red-600/5 border-red-200/50 hover:border-red-300/70 text-red-600',
  };

  const colorClass = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <Link href={`/category/${category.slug}`} className="block h-full">
      <Card className={cn(
        'group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br h-full',
        colorClass,
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
              <IconComponent className="size-6 transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold group-hover:text-current transition-colors duration-200 text-foreground">
                {category.name}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                {category.toolCount} {category.toolCount === 1 ? 'tool' : 'tools'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-muted-foreground">
            {category.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}