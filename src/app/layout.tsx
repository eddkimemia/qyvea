import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { SITE } from "@/lib/constants";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://syntech.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | Kenya's Security & IT Integration Experts — CCTV, Solar, Biometrics`,
    template: `%s | ${SITE.name}`,
  },
  description: `${SITE.description} Licensed NCA, EPRA, PSRA, ISO 9001:2015. 500+ projects, 47 counties. 5-year warranty, 2-hour response.`,
  keywords: [
    "CCTV Kenya", "CCTV installation Nairobi", "biometrics Kenya", "electric fence Kenya", "solar Kenya", "solar backup", "automatic gates", "fire alarm Kenya", "networking Nairobi", "smart home Kenya", "electrical installation", "BMS", "cybersecurity Kenya", "Syntech", "Syntech Limited", "security company Kenya", "NCA licensed", "EPRA certified",
  ],
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Security & Technology",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: siteUrl,
    siteName: SITE.name,
    type: "website",
    locale: "en_KE",
    images: [{ url: `${siteUrl}/syntechlogo.jpg`, width: 400, height: 120, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    creator: "@syntechsolutions",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
  icons: {
    icon: "/fav.png",
    apple: "/fav.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: siteUrl,
    logo: `${siteUrl}/syntechlogo.jpg`,
    image: `${siteUrl}/syntechlogo.jpg`,
    description: SITE.description,
    address: { "@type": "PostalAddress", streetAddress: SITE.address, addressLocality: "Nairobi", addressCountry: "KE" },
    telephone: SITE.phone,
    email: SITE.email,
    sameAs: [
      "https://wa.me/254715135141",
      "https://www.facebook.com/SyntechSolutions",
      "https://www.instagram.com/syntechsolutions",
      "https://x.com/syntechsolutions",
      "https://www.tiktok.com/@syntechsolutions",
      "https://www.linkedin.com/company/syntech-solutions-ltd",
      "https://www.youtube.com/@syntechsolutions",
    ],
    areaServed: { "@type": "Country", name: "Kenya" },
    priceRange: "KES",
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteUrl,
    potentialAction: { "@type": "SearchAction", target: `${siteUrl}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" },
  };
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <Providers>
          <SiteHeader />
          <MobileBottomBar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <SiteFooter />
        </Providers>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
