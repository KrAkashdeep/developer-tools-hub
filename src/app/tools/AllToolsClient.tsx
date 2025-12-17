'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ToolCard } from "@/components/common/ToolCard";
import ResponsiveGrid from "@/components/common/ResponsiveGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { tools, categories } from "@/lib/data/tools";
import { ChevronDown, ChevronRight, Search, ExpandIcon, ShrinkIcon } from "lucide-react";
import * as TablerIcons from '@tabler/icons-react';
import { cn } from "@/lib/utils";

export default function AllToolsClient() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('devtools-expanded-categories', JSON.stringify(expandedCategories));
      localStorage.setItem('devtools-search-query', searchQuery);
    }
  }, [expandedCategories, searchQuery, isInitialized]);

  // Restore state from localStorage on component mount
  useEffect(() => {
    try {
      const savedExpandedCategories = localStorage.getItem('devtools-expanded-categories');
      const savedSearchQuery = localStorage.getItem('devtools-search-query');
      const savedScrollPosition = localStorage.getItem('devtools-scroll-position');
      const lastVisit = localStorage.getItem('devtools-last-visit');
      const sourceCategory = localStorage.getItem('devtools-source-category');
      
      // Check for category parameter in URL (from breadcrumb navigation)
      const categoryParam = searchParams.get('category');
      
      // Check if user is returning from a tool (within last 5 minutes)
      const isReturningFromTool = lastVisit && (Date.now() - parseInt(lastVisit)) < 5 * 60 * 1000;
      
      // Priority order for expanding categories:
      // 1. URL parameter (from breadcrumb click)
      // 2. Saved expanded categories
      // 3. Source category (if returning from tool)
      if (categoryParam) {
        // User clicked breadcrumb - expand specific category and scroll to it
        setExpandedCategories([categoryParam]);
        setTimeout(() => {
          const categoryElement = document.getElementById(`category-${categoryParam}`);
          if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      } else if (savedExpandedCategories) {
        setExpandedCategories(JSON.parse(savedExpandedCategories));
      } else if (isReturningFromTool && sourceCategory) {
        // If no saved categories but user is returning from a tool, expand the source category
        setExpandedCategories([sourceCategory]);
      }
      
      if (savedSearchQuery && !categoryParam) {
        // Don't restore search if user came from breadcrumb
        setSearchQuery(savedSearchQuery);
      }
      
      // Restore scroll position after a short delay to ensure content is rendered
      if (savedScrollPosition && isReturningFromTool && !categoryParam) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScrollPosition), behavior: 'smooth' });
          
          // If returning from a tool, also scroll to the specific category
          if (sourceCategory) {
            setTimeout(() => {
              const categoryElement = document.getElementById(`category-${sourceCategory}`);
              if (categoryElement) {
                categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 500);
          }
        }, 200);
      }
      
      setIsInitialized(true);
      
      // Clear the last visit timestamp after restoring state
      if (isReturningFromTool) {
        localStorage.removeItem('devtools-last-visit');
        localStorage.removeItem('devtools-source-category');
      }
    } catch (error) {
      console.error('Error restoring state:', error);
      setIsInitialized(true);
    }
  }, [searchParams]);

  // Save scroll position when user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('devtools-scroll-position', window.scrollY.toString());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem('devtools-scroll-position', window.scrollY.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (TablerIcons as any)[iconName] || TablerIcons.IconFolder;
    return IconComponent;
  };

  // Group tools by category and filter by search
  const categorizedTools = useMemo(() => {
    const grouped = categories.map(category => {
      let categoryTools = tools.filter(tool => tool.category === category.id);
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        categoryTools = categoryTools.filter(tool => 
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query)
        );
      }
      
      return {
        ...category,
        tools: categoryTools,
        count: categoryTools.length
      };
    }).filter(category => category.count > 0); // Only show categories with tools
    
    return grouped;
  }, [searchQuery]);

  const totalTools = categorizedTools.reduce((sum, category) => sum + category.count, 0);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const isCurrentlyExpanded = prev.includes(categoryId);
      
      // If closing the category, just remove it
      if (isCurrentlyExpanded) {
        const newExpanded: string[] = [];
        
        // Save immediately when toggling
        if (isInitialized) {
          localStorage.setItem('devtools-expanded-categories', JSON.stringify(newExpanded));
        }
        
        return newExpanded;
      } else {
        // If opening the category, close all others and open only this one
        const newExpanded = [categoryId];
        
        // Save immediately when toggling
        if (isInitialized) {
          localStorage.setItem('devtools-expanded-categories', JSON.stringify(newExpanded));
        }
        
        // Scroll to the category after a short delay to ensure it's expanded
        setTimeout(() => {
          const element = document.getElementById(`category-${categoryId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
        
        return newExpanded;
      }
    });
  };

  const expandAllCategories = () => {
    setExpandedCategories(categorizedTools.map(cat => cat.id));
  };

  const collapseAllCategories = () => {
    setExpandedCategories([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Developer Tools Hub
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover and use our complete collection of {tools.length} professional developer tools, 
              organized by category for easy navigation
            </p>
          </div>
          
          {/* Category Filter Buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categorizedTools.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <Button
                    key={category.id}
                    variant={expandedCategories.includes(category.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      // Always toggle the category (this will close others and open this one)
                      toggleCategory(category.id);
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    <IconComponent className="h-3 w-3" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card border rounded-lg p-4">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tools by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Expand/Collapse Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={expandAllCategories}
                disabled={expandedCategories.length === categorizedTools.length}
                className="flex items-center gap-2"
              >
                <ExpandIcon className="h-4 w-4" />
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAllCategories}
                disabled={expandedCategories.length === 0}
                className="flex items-center gap-2"
              >
                <ShrinkIcon className="h-4 w-4" />
                Collapse All
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h2 className="text-xl font-semibold text-primary">
              {totalTools} {totalTools === 1 ? 'Tool' : 'Tools'} Found
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showing results for <span className="font-medium text-foreground">"{searchQuery}"</span>
            </p>
            {totalTools === 0 && (
              <Button 
                onClick={() => setSearchQuery('')} 
                variant="outline" 
                size="sm" 
                className="mt-3"
              >
                Clear search
              </Button>
            )}
          </div>
        )}



        {/* Category Sections */}
        <div className="space-y-4">
          {categorizedTools.length > 0 ? (
            categorizedTools.map((category, index) => (
              <Card 
                key={category.id}
                id={`category-${category.id}`}
                className={cn(
                  "overflow-hidden transition-all duration-200 hover:shadow-md scroll-mt-20",
                  expandedCategories.includes(category.id) && "ring-2 ring-primary/20"
                )}
              >
                <Collapsible
                  open={expandedCategories.includes(category.id)}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className={cn(
                      "cursor-pointer transition-all duration-200",
                      "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                      expandedCategories.includes(category.id) 
                        ? "bg-muted" 
                        : "hover:bg-muted"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "text-3xl p-2 rounded-lg transition-colors",
                            expandedCategories.includes(category.id) 
                              ? "bg-primary/20" 
                              : "bg-muted/50"
                          )}>
                            {(() => {
                              const IconComponent = getIconComponent(category.icon);
                              return <IconComponent className="h-8 w-8" />;
                            })()}
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-xl font-semibold">
                              {category.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={expandedCategories.includes(category.id) ? "default" : "secondary"} 
                            className="text-sm font-medium px-3 py-1 hidden sm:inline-flex"
                          >
                            {category.count} {category.count === 1 ? 'tool' : 'tools'}
                          </Badge>
                          <div className={cn(
                            "p-1 rounded-full transition-colors",
                            expandedCategories.includes(category.id) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="transition-all duration-300 ease-in-out">
                    <CardContent className="pt-0 pb-6">
                      <div className="border-t border-border/50 pt-6">
                        <ResponsiveGrid type="tools" gap="md">
                          {category.tools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} />
                          ))}
                        </ResponsiveGrid>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <div className="text-muted-foreground mb-6">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-medium mb-2">No tools found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery 
                      ? `No tools match "${searchQuery}". Try different keywords or browse categories.`
                      : "No tools available at the moment."
                    }
                  </p>
                </div>
                {searchQuery && (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setSearchQuery('')} variant="outline">
                      Clear search
                    </Button>
                    <Button onClick={expandAllCategories} variant="default">
                      Browse all categories
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}