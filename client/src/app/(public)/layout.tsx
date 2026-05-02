import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import SidebarAI from '@/components/shared/SidebarAI';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <SidebarAI />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
