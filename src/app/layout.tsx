import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { NeonBackground } from "@/components/NeonBackground";
import { getSiteSettings } from "@/lib/data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Premium neon-themed electronics store. Immersive shopping experience with dynamic products, secure Stripe checkout, and a future-proof dark UI.",
  keywords: ["electronics", "neon", "store", "ecommerce", "gaming", "headphones", "keyboards"],
};

export const viewport: Viewport = {
  themeColor: "#1c120a",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <NeonBackground />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
            <main className="flex-1">{children}</main>
            <Footer siteName={settings.siteName} tagline={settings.tagline} logoUrl={settings.logoUrl} />
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
