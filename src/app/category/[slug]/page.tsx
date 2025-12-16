import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getToolsByCategory } from '@/lib/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import SectionHeader from '@/components/common/SectionHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import * as TablerIcons from '@tabler/icons-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - multidevTools',
    };
  }

  return {
    title: `${category.name} Tools - multidevTools`,
    description: `${category.description}. Browse all ${category.name.toLowerCase()} tools.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(slug);
  const IconComponent = (TablerIcons as any)[category.icon] || TablerIcons.IconFolder;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Categories', href: '/tools' },
          { label: category.name }
        ]}
        className="mb-6"
      />

      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 ${category.color} rounded-lg`}>
          <IconComponent className="h-8 w-8 text-white" />
        </div>
        <div>
          <SectionHeader 
            title={category.name}
            description={category.description}
          />
          <Badge variant="outline" className="mt-2">
            {tools.length} tools
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}