'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsClient() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to use multidevTools effectively
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Welcome to multidevTools documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Documentation content will be added here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}