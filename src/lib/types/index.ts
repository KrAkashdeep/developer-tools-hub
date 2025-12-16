// Core type definitions for multidevTools

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: string;
  slug: string;
  popular: boolean;
  tags: string[];
  component: React.ComponentType;
  examples?: {
    input: string;
    output: string;
    description: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  toolCount: number;
  color: string;
}

export interface SearchIndex {
  tools: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    searchTerms: string[];
  }[];
  categories: {
    id: string;
    name: string;
    description: string;
  }[];
}

export type CategoryId = 
  | 'formatters'
  | 'converters'
  | 'encoders'
  | 'minifiers'
  | 'color-utilities'
  | 'text-utilities'
  | 'generators'
  | 'validators';

export interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    popular?: boolean;
  };
  variant?: 'default' | 'compact' | 'featured';
}

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'tool' | 'category';
  slug: string;
}