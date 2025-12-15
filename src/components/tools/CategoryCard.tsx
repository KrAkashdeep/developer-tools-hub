'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category, getToolsByCategory } from '@/lib/data/tools';
import * as TablerIcons from '@tabler/icons-react';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const IconComponent = (TablerIcons as any)[category.icon] || TablerIcons.IconFolder;
  const toolCount = getToolsByCategory(category.slug).length;

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className={`h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${category.color} rounded-lg`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {toolCount} tools
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {category.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}