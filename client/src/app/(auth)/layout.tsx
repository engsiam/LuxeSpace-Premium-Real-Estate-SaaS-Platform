export const dynamic = 'force-dynamic';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* AUTH CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 lg:px-8 lg:py-16">

        {/* PROFESSIONAL CENTER CONTAINER */}
        <main className="flex-1 px-4 py-10 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}