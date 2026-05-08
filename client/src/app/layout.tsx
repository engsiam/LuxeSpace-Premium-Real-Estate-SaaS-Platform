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
  description: "Redefining luxury living in Bangladesh. Discover exclusive luxury properties, premium estates, and elite real estate listings.",
  keywords: ["luxury real estate", "premium properties Bangladesh", "elite homes", "luxury apartments", "LuxeSpace"],
  authors: [{ name: "LuxeSpace" }],
  creator: "LuxeSpace",
  publisher: "LuxeSpace",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luxespace.com",
    siteName: "LuxeSpace",
    title: "LuxeSpace | Bangladesh's Premier Luxury Real Estate Network",
    description: "Discover exclusive luxury properties in Bangladesh.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LuxeSpace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeSpace | Premier Real Estate",
    description: "Discover exclusive luxury properties in Bangladesh.",
    creator: "@luxespace",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4AF37" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if(typeof window !== 'undefined'){
                    var theme = localStorage.getItem('luxespace-theme');
                    if (!theme) {
                      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    document.documentElement.classList.add(theme);
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
        <body className={`${plusJakarta.className} antialised`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}