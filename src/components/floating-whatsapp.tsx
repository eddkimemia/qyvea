"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";

const PAGE_MESSAGES: Record<string, string> = {
  "/": "Hi Syntech! I'm interested in your security & IT solutions. Can you send me a quote?",
  "/shop": "Hi Syntech! I'm browsing your products and need help finding something. Can you assist?",
  "/cart": "Hi Syntech! I have items in my cart and need help completing my order.",
  "/wishlist": "Hi Syntech! I saved some products on my wishlist and want to proceed with a purchase.",
  "/quote": "Hi Syntech! I'd like to get a detailed quote for a project.",
  "/blog": "Hi Syntech! I read your blog and have some questions about your services.",
  "/login": "Hi Syntech! I need help with my account.",
  "/services/cctv": "Hi Syntech! I'm interested in CCTV installation. Can you send me a quote?",
  "/services/biometrics": "Hi Syntech! I need biometric access control for my premises.",
  "/services/electric-fence": "Hi Syntech! I'd like a quote for electric fencing installation.",
  "/services/automatic-gates": "Hi Syntech! I'm interested in automatic gate installation.",
  "/services/fire-alarm-systems": "Hi Syntech! I need a fire alarm system installed.",
  "/services/networking": "Hi Syntech! I need networking & structured cabling for my office.",
  "/services/smart-home-automation": "Hi Syntech! I want to automate my home with smart systems.",
  "/services/solar-solutions": "Hi Syntech! I'm interested in solar backup solutions.",
  "/services/electrical-installation": "Hi Syntech! I need electrical installation services.",
};

function getMessageForPath(pathname: string): string {
  // Exact match first
  if (PAGE_MESSAGES[pathname]) return PAGE_MESSAGES[pathname];

  // Check if it's a product page (/shop/[slug])
  if (pathname.startsWith("/shop/")) {
    const slug = pathname.split("/shop/")[1];
    const productName = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `Hi Syntech! I'm interested in the "${productName}" product. Is it available? Can you send me details and pricing?`;
  }

  // Check if it's a service page (/services/[slug])
  if (pathname.startsWith("/services/")) {
    const slug = pathname.split("/services/")[1];
    const serviceName = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `Hi Syntech! I need a quote for ${serviceName}. Can you help?`;
  }

  // Check if it's an admin page
  if (pathname.startsWith("/admin")) {
    return "Hi Syntech! I'm having trouble with the admin dashboard. Can you help?";
  }

  // Default fallback
  return "Hi Syntech! I need help with your services. Can you assist?";
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const message = getMessageForPath(pathname);

  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-[60] bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full p-3.5 md:p-4 shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] transition-all hover:scale-105 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 md:h-7 md:w-7 fill-white" aria-hidden="true">
        <path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z" />
      </svg>
    </a>
  );
}
