export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full border-border bg-card rounded-[2rem] overflow-hidden p-12 text-center">
        <div className="text-8xl font-black text-primary/20 mb-4">404</div>
        <h2 className="text-3xl font-black text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground font-medium text-lg mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 2 2-2 2"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m3 11 2-2-2-2"/></svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
