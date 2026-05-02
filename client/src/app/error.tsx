'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-border bg-card rounded-[2rem]">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-black text-foreground">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground font-medium">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => reset()} 
              className="px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted font-medium transition-colors"
            >
              Try again
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="px-6 py-3 rounded-xl bg-primary text-secondary font-medium hover:bg-primary/80 transition-colors"
            >
              Go Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
