import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LuxeSpace | Elite Property Network",
  description: "Redefining luxury living in Bangladesh. We provide a seamless, technology-driven experience for the elite real estate market.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${plusJakarta.className} antialised`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
