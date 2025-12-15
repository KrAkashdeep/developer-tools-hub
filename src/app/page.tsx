import SearchBar from "@/components/search/SearchBar";
import CategoryCard from "@/components/tools/CategoryCard";
import ToolCard from "@/components/tools/ToolCard";
import ResponsiveGrid from "@/components/common/ResponsiveGrid";
import { Button } from "@/components/ui/button";
import { categories, tools } from "@/lib/data/tools";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Palette } from "lucide-react";
import * as TablerIcons from '@tabler/icons-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "multiDevtools - 80+ Free Developer Tools Suite",
  description: "Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more. JSON formatter, Base64 encoder, color converter, text utilities, and many more. Fast, free, and works entirely in your browser.",
  keywords: [
    "developer tools",
    "json formatter",
    "base64 encoder",
    "color converter",
    "text utilities",
    "code formatter",
    "online tools",
    "free developer tools",
    "web development tools",
    "programming utilities"
  ],
  openGraph: {
    title: "multiDevtools - 80+ Free Developer Tools Suite",
    description: "Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more. Fast, free, and works entirely in your browser.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "multiDevtools - 80+ Free Developer Tools Suite",
    description: "Complete developer toolkit with 80+ tools for formatting, converting, encoding, and more.",
  },
};

export default function Home() {
  // Get popular tools (tools marked as popular or first 6 tools)
  const popularTools = tools.filter(tool => tool.popular).slice(0, 6) || tools.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              {tools.length}+ Developer Tools Available
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Developer Tools Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Your complete developer toolkit with {tools.length}+ professional tools for formatting, converting, 
              encoding, validation, and more. Fast, free, and works entirely in your browser with no data sent to servers.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 flex justify-center">
            <SearchBar className="w-full max-w-2xl" />
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border">
              <Zap className="h-8 w-8 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Instant Processing</h3>
                <p className="text-sm text-muted-foreground">Real-time results as you type</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Privacy First</h3>
                <p className="text-sm text-muted-foreground">All processing happens locally</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border">
              <Palette className="h-8 w-8 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Beautiful Interface</h3>
                <p className="text-sm text-muted-foreground">Dark & light themes available</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Link href="/tools">
                Browse All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
              <Link href="#categories">
                Explore Categories
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{tools.length}+</div>
              <div className="text-sm text-muted-foreground">Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Data Sent</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tool Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover tools organized by category to find exactly what you need for your development workflow.
              Click on any category to explore its tools.
            </p>
          </div>

          <ResponsiveGrid type="categories" gap="md">
            {categories.map((category) => {
              const categoryToolCount = tools.filter(tool => tool.category === category.id).length;
              return (
                <Link key={category.id} href="/tools" className="block group">
                  <div className="p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">
                        {(() => {
                          const IconComponent = (TablerIcons as any)[category.icon] || TablerIcons.IconFolder;
                          return <IconComponent className="h-10 w-10" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {categoryToolCount} tools available
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </ResponsiveGrid>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href="/tools">
                View All Tools by Category
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start with these frequently used tools that developers love. Each tool works instantly in your browser.
            </p>
          </div>

          <ResponsiveGrid type="tools" gap="md">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </ResponsiveGrid>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/tools">
                Explore All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose multiDevtools?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Every tool is designed with performance, privacy, and usability in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                All tools process data instantly in your browser. No waiting, no loading screens, just immediate results.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Private</h3>
              <p className="text-muted-foreground">
                Your data never leaves your device. All processing happens locally in your browser for maximum privacy.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
              <p className="text-muted-foreground">
                Clean, modern interface with dark and light themes. Designed for productivity and ease of use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who use multiDevtools daily. Start with any tool and discover your new favorites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl">
              <Link href="/tools">
                Browse All {tools.length}+ Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}