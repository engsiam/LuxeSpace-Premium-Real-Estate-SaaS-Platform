import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://luxespace.com'),
  title: {
    default: "LuxeSpace | Elite Property Network",
    template: "%s | LuxeSpace",
  },
  description: "Redefining luxury living in Bangladesh. Discover exclusive luxury properties, premium estates, and elite real estate listings. Your gateway to Bangladesh's most prestigious properties.",
  keywords: ["luxury real estate", "premium properties Bangladesh", "elite homes", "luxury apartments", "high-end real estate", "exclusive properties", "LuxeSpace"],
  authors: [{ name: "LuxeSpace" }],
  creator: "LuxeSpace",
  publisher: "LuxeSpace",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luxespace.com",
    siteName: "LuxeSpace",
    title: "LuxeSpace | Elite Property Network",
    description: "Redefining luxury living in Bangladesh. Discover exclusive luxury properties, premium estates, and elite real estate listings.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LuxeSpace - Elite Property Network Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeSpace | Elite Property Network",
    description: "Redefining luxury living in Bangladesh. Discover exclusive luxury properties.",
    creator: "@luxespace",
    images: ["/og-image.svg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
