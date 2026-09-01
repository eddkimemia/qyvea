import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Kenya's Security & IT Integration Experts`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["CCTV Kenya", "biometrics", "solar", "electric fence", "Nairobi security", "Qyvea"],
  authors: [{ name: SITE.name }],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Floating WhatsApp — official #25D366 */}
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=Hi%20Qyvea!%20I%20need%20a%20quote.`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full p-3.5 md:p-4 shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          {/* Official WhatsApp bubble icon — white */}
          <svg viewBox="0 0 32 32" className="h-7 w-7 md:h-7 md:w-7 fill-white" aria-hidden="true">
            <path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
