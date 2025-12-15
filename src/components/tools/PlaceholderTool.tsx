'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconTool, IconCode } from '@tabler/icons-react';

interface PlaceholderToolProps {
  toolName: string;
  description: string;
  category: string;
}

export default function PlaceholderTool({ toolName, description, category }: PlaceholderToolProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
            <IconTool className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{toolName}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-6 bg-muted/50 rounded-lg">
            <IconCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              This {category} tool is currently under development. We're working hard to bring you 
              the best possible experience with full functionality.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✨ Real-time processing</p>
              <p>📋 One-click copy functionality</p>
              <p>🎨 Beautiful, intuitive interface</p>
              <p>🔒 Complete privacy - all processing happens locally</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button asChild>
              <a href="/tools">Browse All Tools</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to expect</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            When completed, this tool will provide {description.toLowerCase()} with the same 
            high-quality experience you've come to expect from multiDevtools. All tools are 
            designed to be fast, secure, and easy to use.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}