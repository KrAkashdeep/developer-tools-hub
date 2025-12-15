import { SearchIndex, SearchResult } from '../types';
import { tools } from '../data/tools';
import { categories } from '../data/categories';

// Create search index for autocomplete functionality
export const createSearchIndex = (): SearchIndex => {
  const toolsIndex = tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    tags: tool.tags || [],
    searchTerms: [
      tool.name.toLowerCase(),
      tool.description.toLowerCase(),
      ...(tool.tags || []).map(tag => tag.toLowerCase()),
      tool.category.toLowerCase()
    ]
  }));

  const categoriesIndex = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description
  }));

  return {
    tools: toolsIndex,
    categories: categoriesIndex
  };
};

// Fuzzy search function for autocomplete
export const fuzzySearch = (query: string, searchIndex: SearchIndex): SearchResult[] => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search tools
  searchIndex.tools.forEach(tool => {
    let score = 0;
    let matchFound = false;

    // Exact name match gets highest score
    if (tool.name.toLowerCase() === normalizedQuery) {
      score = 100;
      matchFound = true;
    }
    // Name starts with query gets high score
    else if (tool.name.toLowerCase().startsWith(normalizedQuery)) {
      score = 90;
      matchFound = true;
    }
    // Name contains query gets medium score
    else if (tool.name.toLowerCase().includes(normalizedQuery)) {
      score = 70;
      matchFound = true;
    }
    // Description contains query gets lower score
    else if (tool.description.toLowerCase().includes(normalizedQuery)) {
      score = 50;
      matchFound = true;
    }
    // Tags contain query gets lower score
    else if (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
      score = 40;
      matchFound = true;
    }
    // Category matches query gets lowest score
    else if (tool.category.toLowerCase().includes(normalizedQuery)) {
      score = 30;
      matchFound = true;
    }

    if (matchFound) {
      const toolData = tools.find(t => t.id === tool.id);
      if (toolData) {
        results.push({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          type: 'tool',
          slug: toolData.slug
        });
      }
    }
  });

  // Search categories
  searchIndex.categories.forEach(category => {
    let matchFound = false;

    if (category.name.toLowerCase().includes(normalizedQuery) ||
        category.description.toLowerCase().includes(normalizedQuery)) {
      matchFound = true;
    }

    if (matchFound) {
      const categoryData = categories.find(c => c.id === category.id);
      if (categoryData) {
        results.push({
          id: category.id,
          name: category.name,
          description: category.description,
          category: '',
          type: 'category',
          slug: categoryData.slug
        });
      }
    }
  });

  // Sort by relevance (exact matches first, then by name)
  return results
    .sort((a, b) => {
      // Exact matches first
      const aExact = a.name.toLowerCase() === normalizedQuery;
      const bExact = b.name.toLowerCase() === normalizedQuery;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by name alphabetically
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10); // Limit to 10 results for performance
};

// Get recent searches from localStorage
export const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const recent = localStorage.getItem('devtools-recent-searches');
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
};

// Save search to recent searches
export const saveRecentSearch = (query: string): void => {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  try {
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('devtools-recent-searches', JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
};

// Get popular tools for suggestions
export const getPopularToolSuggestions = (): SearchResult[] => {
  return tools
    .filter(tool => tool.popular)
    .map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      type: 'tool' as const,
      slug: tool.slug
    }))
    .slice(0, 5);
};