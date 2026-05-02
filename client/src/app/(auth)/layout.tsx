
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Container } from '@/components/shared/LayoutComponents';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full">
        <Container className="py-20 flex justify-center items-center min-h-[calc(100vh-200px)]">
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
