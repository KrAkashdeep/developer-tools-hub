'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IconLoader2 } from '@tabler/icons-react';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <IconLoader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading...</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we prepare your tools.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}