import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <div className="hidden lg:flex gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <Skeleton className="h-96 w-full rounded-[3rem] mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80 rounded-[2rem]" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-[3rem] mb-16" />
      </div>
    </div>
  );
}
