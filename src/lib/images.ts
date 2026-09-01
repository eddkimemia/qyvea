// Curated Unsplash tech images — optimized via Unsplash CDN (auto=format, w param)
// All free to use, no attribution required but credited.
// Keep list centralized for easy swap.

export const IMAGES = {
  hero: {
    // Modern security ops center / server room
    cctv: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1920&q=80",
    // Alternative hero
    server: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80",
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
  },
  products: {
    cctvKit: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    biometric: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    gate: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    fire: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80",
    networking: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    smartHome: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    electrical: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    energizer: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
    intercom: "https://images.unsplash.com/photo-1596551429488-9be11a3552a8?auto=format&fit=crop&w=800&q=80",
  },
  services: {
    cctv: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    biometric: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    networking: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    smartHome: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    estate: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    maintenance: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  },
  about: {
    team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    office: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    nairobi: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
} as const;

// Fallback image if product has no image - pick by category
export function imageForCategory(cat: string) {
  const k = cat.toUpperCase();
  if (k.includes("CCTV")) return IMAGES.products.cctvKit;
  if (k.includes("BIO")) return IMAGES.products.biometric;
  if (k.includes("SOLAR")) return IMAGES.products.solar;
  if (k.includes("GATE")) return IMAGES.products.gate;
  if (k.includes("FIRE")) return IMAGES.products.fire;
  if (k.includes("NETWORK")) return IMAGES.products.networking;
  if (k.includes("SMART")) return IMAGES.products.smartHome;
  if (k.includes("ELECTRIC")) return IMAGES.products.electrical;
  if (k.includes("ELECT")) return IMAGES.products.energizer;
  return IMAGES.products.networking;
}
