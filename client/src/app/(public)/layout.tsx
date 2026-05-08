export const dynamic = 'force-dynamic';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
