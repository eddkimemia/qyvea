import { PrismaClient, Category, ServiceSlug } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Syntech database...");

  // Settings
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsappNumber: "254715135141",
      promoText: "Free Delivery in Nairobi on orders over KES 5,000",
      promoActive: true,
    },
  });

  // Services — Syntech 2026 (19 incl. Website, Graphic, AI)
  const services = [
    { slug: ServiceSlug.CCTV, title: "CCTV Installation", excerpt: "Professional CCTV surveillance, remote monitoring, 4/8/16+ camera kits.", icon: "Video", priceFrom: 25000 },
    { slug: ServiceSlug.BIOMETRICS, title: "Biometric Access Control", excerpt: "Fingerprint, face, card access for offices & homes.", icon: "Fingerprint", priceFrom: 18000 },
    { slug: ServiceSlug.ELECTRIC_FENCE, title: "Electric Fencing", excerpt: "Perimeter security with energizer, alarm & monitoring.", icon: "Zap", priceFrom: 45000 },
    { slug: ServiceSlug.AUTOMATIC_GATES, title: "Automatic Gates", excerpt: "Swing/sliding automation with remote & intercom.", icon: "Gate", priceFrom: 85000 },
    { slug: ServiceSlug.FIRE_ALARM, title: "Fire Alarm Systems", excerpt: "Addressable & conventional fire detection.", icon: "Flame", priceFrom: 35000 },
    { slug: ServiceSlug.NETWORKING, title: "Networking & Structured Cabling", excerpt: "LAN, fiber, WiFi, racks & points.", icon: "Network", priceFrom: 15000 },
    { slug: ServiceSlug.SMART_HOME, title: "Smart Home Automation", excerpt: "Lights, locks, curtains, voice control.", icon: "Home", priceFrom: 40000 },
    { slug: ServiceSlug.SOLAR_INSTALLATION, title: "Solar Installation", excerpt: "On-grid, off-grid, hybrid for homes & biz.", icon: "Sun", priceFrom: 95000 },
    { slug: ServiceSlug.SOLAR_BACKUP, title: "Solar Backup Solutions", excerpt: "Keep CCTV/fence/lights on during blackouts.", icon: "Battery", priceFrom: 85000 },
    { slug: ServiceSlug.ELECTRICAL_INSTALLATION, title: "Electrical Installation", excerpt: "Wiring, DBs, compliance & testing.", icon: "Plug", priceFrom: 12000 },
    { slug: ServiceSlug.BMS, title: "Building Management System", excerpt: "Centralized control for large facilities.", icon: "Building", priceFrom: 150000 },
    { slug: ServiceSlug.CYBERSECURITY, title: "Cybersecurity", excerpt: "Audit, firewall, endpoint protection.", icon: "Shield", priceFrom: 20000 },
    { slug: ServiceSlug.SYSTEM_INTEGRATION, title: "System Integration", excerpt: "Unify security, IT & power systems.", icon: "Layers", priceFrom: 30000 },
    { slug: ServiceSlug.IT_SUPPORT, title: "IT Support", excerpt: "Helpdesk, maintenance, uptime SLA.", icon: "Headset", priceFrom: 8000 },
    { slug: ServiceSlug.MAINTENANCE, title: "Maintenance & Repair", excerpt: "24/7 support, 2hr response Nairobi/Msa/Ksm.", icon: "Wrench", priceFrom: 3000 },
    { slug: ServiceSlug.ESTATE_SOLUTIONS, title: "Estate Solutions", excerpt: "Bulk pricing for 50-200 homes, one contract.", icon: "Homes", priceFrom: 0 },
    { slug: ServiceSlug.WEBSITE_DESIGN, title: "Website Design", excerpt: "Modern, fast, SEO-ready websites that convert visitors to customers.", icon: "Globe", priceFrom: 35000 },
    { slug: ServiceSlug.GRAPHIC_DESIGN, title: "Graphic Design", excerpt: "Logos, brand identity, social and print that make you memorable.", icon: "Palette", priceFrom: 8000 },
    { slug: ServiceSlug.AI_SOLUTIONS, title: "AI Solutions", excerpt: "Chatbots, automation, analytics — practical AI for Kenyan businesses.", icon: "Bot", priceFrom: 45000 },
  ];

  const serviceImages: Record<string,string> = {
    CCTV: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    BIOMETRICS: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    ELECTRIC_FENCE: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    AUTOMATIC_GATES: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    FIRE_ALARM: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80",
    NETWORKING: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    SMART_HOME: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    SOLAR_INSTALLATION: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    SOLAR_BACKUP: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    ELECTRICAL_INSTALLATION: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    BMS: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    CYBERSECURITY: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    SYSTEM_INTEGRATION: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    IT_SUPPORT: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    MAINTENANCE: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    ESTATE_SOLUTIONS: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    WEBSITE_DESIGN: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    GRAPHIC_DESIGN: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    AI_SOLUTIONS: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  };
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { title: s.title, excerpt: s.excerpt, image: serviceImages[s.slug] },
      create: {
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        icon: s.icon,
        image: serviceImages[s.slug],
        priceFrom: s.priceFrom,
        featured: ["CCTV", "BIOMETRICS", "ELECTRIC_FENCE", "SOLAR_BACKUP"].includes(s.slug),
      },
    });
  }

  // Admin user
  const adminPass = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@syntech.co.ke" },
    update: {},
    create: {
      email: "admin@syntech.co.ke",
      name: "Syntech Admin",
      password: adminPass,
      role: "ADMIN",
      phone: "0715135141",
    },
  });

  // Partner demo
  const partnerPass = await bcrypt.hash("Partner123!", 10);
  await prisma.user.upsert({
    where: { email: "partner@syntech.co.ke" },
    update: {},
    create: {
      email: "partner@syntech.co.ke",
      name: "Demo Partner",
      password: partnerPass,
      role: "PARTNER",
      refCode: "QYV-PARTNER-001",
    },
  });

  // Products - full catalogue covering ALL 13 categories (Unsplash tech images)
  const img = {
    cctv: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    cctv2: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
    cctv3: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    cctv4: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    bio: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    bio2: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    bio3: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    fence: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
    fence2: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    fence3: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    gate: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    gate2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    fire: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80",
    fire2: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
    solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    solar2: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
    solar3: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    net: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    net2: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    net3: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
    smart: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    smart2: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    smart3: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    intercom: "https://images.unsplash.com/photo-1596551429488-9be11a3552a8?auto=format&fit=crop&w=800&q=80",
    intercom2: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
    access: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    access2: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    access3: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    electrical: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    electrical2: "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?auto=format&fit=crop&w=800&q=80",
    electrical3: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
    itsupport: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    itsupport2: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    itsupport3: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
    acc: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    acc2: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    acc3: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  };
  const products = [
    // CCTV - 4
    { name: "Hikvision 4CH DVR Kit - 4 Bullet Cameras 1080p + 1TB", slug: "hikvision-4ch-kit-4bullet-1080p", category: Category.CCTV, price: 28500, oldPrice: 32000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 34, sold: 128, stockQty: 25, installationAvailable: true, labourPrice: 4500, image: img.cctv },
    { name: "Hikvision 8CH NVR Kit - 8 Dome Cameras 2MP + 2TB", slug: "hikvision-8ch-kit-8dome-2mp", category: Category.CCTV, price: 52000, oldPrice: 58000, featured: true, badge: "FEATURED", rating: 4.8, reviewsCount: 56, sold: 89, stockQty: 18, installationAvailable: true, labourPrice: 6500, image: img.cctv2 },
    { name: "Dahua 16CH Kit - 16 Cameras 5MP + 4TB + Analytics", slug: "dahua-16ch-5mp-analytics", category: Category.CCTV, price: 115000, featured: true, rating: 4.9, reviewsCount: 22, sold: 41, stockQty: 8, installationAvailable: true, labourPrice: 12000, image: img.cctv3 },
    { name: "Hikvision PTZ 4MP 25x Zoom + Auto-Tracking", slug: "hikvision-ptz-4mp-25x", category: Category.CCTV, price: 68000, oldPrice: 75000, featured: false, badge: "NEW", rating: 4.8, reviewsCount: 19, sold: 27, stockQty: 12, installationAvailable: true, labourPrice: 4500, image: img.cctv4 },
    // BIOMETRICS - 3
    { name: "ZKTeco F22 Biometric + Card Reader", slug: "zkteco-f22-biometric", category: Category.BIOMETRICS, price: 18500, oldPrice: 21000, featured: true, rating: 4.6, reviewsCount: 41, sold: 203, stockQty: 30, installationAvailable: true, labourPrice: 2500, image: img.bio },
    { name: "Hikvision Face Recognition Terminal DS-K1T341A", slug: "hikvision-face-terminal-k1t341a", category: Category.BIOMETRICS, price: 42000, rating: 4.5, reviewsCount: 18, sold: 34, stockQty: 12, installationAvailable: true, labourPrice: 3500, image: img.bio2 },
    { name: "ZKTeco SpeedFace V5L - Face + Palm + Mask", slug: "zkteco-speedface-v5l", category: Category.BIOMETRICS, price: 38500, featured: false, badge: "NEW", rating: 4.7, reviewsCount: 14, sold: 22, stockQty: 9, installationAvailable: true, labourPrice: 3000, image: img.bio3 },
    // ELECTRIC FENCE - 3
    { name: "Nemtek Energizer Druid 18 + Battery + Siren", slug: "nemtek-druid-18-energizer", category: Category.ELECTRIC_FENCE, price: 38000, featured: true, rating: 4.7, reviewsCount: 29, sold: 76, stockQty: 14, installationAvailable: true, labourPrice: 8000, image: img.fence },
    { name: "Nemtek Druid 25 - 5 Joule 8km Fence Kit", slug: "nemtek-druid-25-kit", category: Category.ELECTRIC_FENCE, price: 52000, rating: 4.6, reviewsCount: 18, sold: 41, stockQty: 8, installationAvailable: true, labourPrice: 9500, image: img.fence2 },
    { name: "Electric Fence Accessories Pack - 500m Wire + Insulators", slug: "fence-accessories-500m", category: Category.ELECTRIC_FENCE, price: 18500, rating: 4.5, reviewsCount: 24, sold: 63, stockQty: 20, installationAvailable: false, image: img.fence3 },
    // GATE AUTOMATION - 3
    { name: "Centurion D5 Evo Sliding Gate Motor 500kg", slug: "centurion-d5-evo-500kg", category: Category.GATE_AUTOMATION, price: 68000, oldPrice: 75000, featured: true, rating: 4.8, reviewsCount: 37, sold: 52, stockQty: 10, installationAvailable: true, labourPrice: 9000, image: img.gate },
    { name: "Centurion Swing Gate Motor - Double Leaf Kit", slug: "centurion-swing-double-kit", category: Category.GATE_AUTOMATION, price: 82000, rating: 4.6, reviewsCount: 21, sold: 28, stockQty: 6, installationAvailable: true, labourPrice: 11000, image: img.gate2 },
    { name: "Gate Safety Beams + Flashing Light + Remotes", slug: "gate-safety-beams-kit", category: Category.GATE_AUTOMATION, price: 9500, rating: 4.4, reviewsCount: 33, sold: 71, stockQty: 18, installationAvailable: true, labourPrice: 1500, image: img.access3 },
    // FIRE ALARM - 3
    { name: "Fire Alarm Panel 4-Zone Conventional + 8 Detectors", slug: "fire-panel-4zone-8detectors", category: Category.FIRE_ALARM, price: 55000, rating: 4.6, reviewsCount: 12, sold: 19, stockQty: 7, installationAvailable: true, labourPrice: 6000, image: img.fire },
    { name: "Addressable Fire Panel 1-Loop + 20 Smoke Detectors", slug: "fire-addressable-1loop-20det", category: Category.FIRE_ALARM, price: 125000, rating: 4.7, reviewsCount: 9, sold: 14, stockQty: 4, installationAvailable: true, labourPrice: 12000, image: img.fire2 },
    { name: "Fire Bell 6\" + Manual Call Point + Strobe", slug: "fire-bell-callpoint-strobe", category: Category.FIRE_ALARM, price: 8500, rating: 4.5, reviewsCount: 27, sold: 48, stockQty: 22, installationAvailable: true, labourPrice: 1800, image: img.fire },
    // SOLAR - 3
    { name: "Solar Backup Kit 3KVA Inverter + 2x200Ah + 2x550W", slug: "solar-backup-3kva-200ah", category: Category.SOLAR, price: 145000, oldPrice: 165000, featured: true, badge: "SALE", rating: 4.9, reviewsCount: 44, sold: 63, stockQty: 9, installationAvailable: true, labourPrice: 12000, image: img.solar },
    { name: "Solar Backup Kit 5KVA Hybrid + Lithium 5kWh", slug: "solar-backup-5kva-lithium", category: Category.SOLAR, price: 285000, rating: 4.8, reviewsCount: 21, sold: 27, stockQty: 5, installationAvailable: true, labourPrice: 18000, image: img.solar2 },
    { name: "550W Monocrystalline Solar Panel - Tier 1", slug: "solar-panel-550w-tier1", category: Category.SOLAR, price: 18500, rating: 4.7, reviewsCount: 38, sold: 94, stockQty: 30, installationAvailable: true, labourPrice: 2500, image: img.solar3 },
    // NETWORKING - 3
    { name: "Ubiquiti UniFi 24-Port PoE Switch", slug: "unifi-24-port-poe", category: Category.NETWORKING, price: 48000, rating: 4.7, reviewsCount: 33, sold: 71, stockQty: 16, installationAvailable: true, labourPrice: 3000, image: img.net },
    { name: "Cat6 Outdoor Cable 305m + RJ45 + Trunking", slug: "cat6-outdoor-305m", category: Category.NETWORKING, price: 18500, rating: 4.5, reviewsCount: 27, sold: 94, stockQty: 22, installationAvailable: false, image: img.net2 },
    { name: "Ubiquiti LiteAP AC 120° Sector Antenna", slug: "ubiquiti-liteap-ac", category: Category.NETWORKING, price: 16500, featured: false, rating: 4.6, reviewsCount: 19, sold: 36, stockQty: 14, installationAvailable: true, labourPrice: 2000, image: img.net3 },
    // SMART HOME - 3
    { name: "Smart WiFi Door Lock - Fingerprint + PIN + App", slug: "smart-wifi-door-lock", category: Category.SMART_HOME, price: 22500, featured: true, rating: 4.6, reviewsCount: 58, sold: 112, stockQty: 20, installationAvailable: true, labourPrice: 2000, image: img.smart },
    { name: "Smart Curtain Motor + Zigbee Hub + Remote", slug: "smart-curtain-motor-kit", category: Category.SMART_HOME, price: 18500, rating: 4.5, reviewsCount: 22, sold: 41, stockQty: 12, installationAvailable: true, labourPrice: 2500, image: img.smart2 },
    { name: "Tuya Smart Light Switch 3-Gang + Voice Control", slug: "tuya-smart-switch-3gang", category: Category.SMART_HOME, price: 4500, rating: 4.4, reviewsCount: 47, sold: 134, stockQty: 35, installationAvailable: true, labourPrice: 1200, image: img.smart3 },
    // INTERCOM - 2
    { name: "Video Doorbell Intercom 7\" Touch + Outdoor Unit", slug: "video-intercom-7inch", category: Category.INTERCOM, price: 19500, rating: 4.4, reviewsCount: 19, sold: 38, stockQty: 15, installationAvailable: true, labourPrice: 2500, image: img.intercom },
    { name: "IP Intercom Indoor Station + Outdoor Panel + PoE", slug: "ip-intercom-indoor-outdoor", category: Category.INTERCOM, price: 32000, rating: 4.5, reviewsCount: 16, sold: 24, stockQty: 8, installationAvailable: true, labourPrice: 3000, image: img.intercom2 },
    // ACCESS_CONTROL - 3
    { name: "Access Control Magnetic Lock 300kg + Bracket + PSU", slug: "mag-lock-300kg-kit", category: Category.ACCESS_CONTROL, price: 8500, rating: 4.5, reviewsCount: 31, sold: 156, stockQty: 40, installationAvailable: true, labourPrice: 1800, image: img.access },
    { name: "Hikvision Access Controller 4-Door + Card Readers", slug: "hikvision-access-4door", category: Category.ACCESS_CONTROL, price: 48000, rating: 4.6, reviewsCount: 13, sold: 19, stockQty: 7, installationAvailable: true, labourPrice: 5000, image: img.access2 },
    { name: "Turnstile Tripod + RFID Reader + Controller", slug: "turnstile-tripod-rfid", category: Category.ACCESS_CONTROL, price: 95000, rating: 4.7, reviewsCount: 11, sold: 15, stockQty: 5, installationAvailable: true, labourPrice: 9000, image: img.access3 },
    // ELECTRICAL - 3
    { name: "Distribution Board 12-Way + MCBs + RCBO", slug: "db-12way-mcb-rcbo", category: Category.ELECTRICAL, price: 12500, rating: 4.6, reviewsCount: 28, sold: 67, stockQty: 18, installationAvailable: true, labourPrice: 3000, image: img.electrical },
    { name: "Electrical Wiring Kit - 2.5mm Twin + Earth 100m", slug: "wiring-2-5mm-100m", category: Category.ELECTRICAL, price: 8500, rating: 4.5, reviewsCount: 34, sold: 89, stockQty: 25, installationAvailable: false, image: img.electrical2 },
    { name: "LED Floodlight 100W IP65 + Photocell", slug: "led-floodlight-100w", category: Category.ELECTRICAL, price: 4200, featured: false, badge: "HOT", rating: 4.7, reviewsCount: 52, sold: 143, stockQty: 30, installationAvailable: true, labourPrice: 1000, image: img.electrical3 },
    // IT_SUPPORT - 3
    { name: "IT Support Package - SME Monthly (5 Devices)", slug: "it-support-sme-monthly", category: Category.IT_SUPPORT, price: 12000, rating: 4.8, reviewsCount: 21, sold: 44, stockQty: 100, installationAvailable: false, image: img.itsupport },
    { name: "NAS Synology DS220+ 2-Bay + 2x4TB + Setup", slug: "nas-synology-ds220-4tb", category: Category.IT_SUPPORT, price: 68000, rating: 4.7, reviewsCount: 16, sold: 22, stockQty: 6, installationAvailable: true, labourPrice: 4000, image: img.itsupport2 },
    { name: "Annual Antivirus + Backup + Firewall Bundle", slug: "antivirus-backup-firewall-bundle", category: Category.IT_SUPPORT, price: 9500, rating: 4.5, reviewsCount: 31, sold: 58, stockQty: 50, installationAvailable: false, image: img.itsupport3 },
    // ACCESSORIES - 3
    { name: "CCTV Power Supply 12V 10A + 8-Way Splitter", slug: "cctv-psu-12v-10a-8way", category: Category.ACCESSORIES, price: 2800, rating: 4.6, reviewsCount: 62, sold: 210, stockQty: 45, installationAvailable: false, image: img.acc },
    { name: "HDD Seagate SkyHawk 4TB Surveillance", slug: "hdd-skyhawk-4tb", category: Category.ACCESSORIES, price: 11500, featured: true, rating: 4.8, reviewsCount: 41, sold: 98, stockQty: 20, installationAvailable: false, image: img.acc2 },
    { name: "RJ45 Connectors + Crimp Tool + Tester Kit", slug: "rj45-crimptool-tester-kit", category: Category.ACCESSORIES, price: 3500, rating: 4.5, reviewsCount: 48, sold: 176, stockQty: 40, installationAvailable: false, image: img.acc3 },
    // ICT PRODUCTS - 60
    // Monitors - 10
    { name: "Dell 24\" FHD Monitor P2422H - IPS, USB-C", slug: "dell-24-fhd-p2422h", category: Category.ICT, price: 28500, oldPrice: 32000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 45, sold: 112, stockQty: 25, installationAvailable: false, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
    { name: "HP 27\" 4K UHD Monitor Z27n G2 - USB-C Daisy Chain", slug: "hp-27-4k-z27n-g2", category: Category.ICT, price: 48500, rating: 4.8, reviewsCount: 28, sold: 56, stockQty: 14, installationAvailable: false, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80" },
    { name: "LG 32\" QHD Monitor 32QN600-B - HDR10, AMD FreeSync", slug: "lg-32-qhd-32qn600b", category: Category.ICT, price: 35000, oldPrice: 39000, featured: false, rating: 4.6, reviewsCount: 33, sold: 78, stockQty: 18, installationAvailable: false, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
    { name: "Samsung 24\" Curved Monitor C24F390FHE - Full HD", slug: "samsung-24-curved-c24f390fhe", category: Category.ICT, price: 18500, oldPrice: 21000, featured: true, badge: "SALE", rating: 4.5, reviewsCount: 62, sold: 189, stockQty: 30, installationAvailable: false, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80" },
    { name: "Lenovo 23.8\" FHD ThinkVision T24i-20 - IPS, USB Hub", slug: "lenovo-238-thinkvision-t24i", category: Category.ICT, price: 26500, rating: 4.6, reviewsCount: 29, sold: 67, stockQty: 20, installationAvailable: false, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
    { name: "ASUS 27\" ProArt PA278QV - sRGB 100%, Factory Calibrated", slug: "asus-27-proart-pa278qv", category: Category.ICT, price: 42000, rating: 4.8, reviewsCount: 19, sold: 34, stockQty: 10, installationAvailable: false, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80" },
    { name: "Dell 34\" Ultrawide U3423WE - Curved, USB-C Hub", slug: "dell-34-ultrawide-u3423we", category: Category.ICT, price: 72000, oldPrice: 82000, featured: true, badge: "FEATURED", rating: 4.9, reviewsCount: 14, sold: 22, stockQty: 6, installationAvailable: false, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
    { name: "HP 15.6\" Portable Monitor 15-bs0xx - USB-C Travel", slug: "hp-156-portable-monitor", category: Category.ICT, price: 22500, rating: 4.4, reviewsCount: 21, sold: 45, stockQty: 15, installationAvailable: false, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80" },
    { name: "BenQ 27\" EyeCare Monitor GW2780 - Low Blue Light, FHD", slug: "benq-27-eyecare-gw2780", category: Category.ICT, price: 24000, rating: 4.5, reviewsCount: 37, sold: 89, stockQty: 22, installationAvailable: false, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
    { name: "AOC 23.8\" Gaming Monitor 24G2SPU - 165Hz, 1ms", slug: "aoc-238-gaming-24g2spu", category: Category.ICT, price: 22000, featured: false, badge: "NEW", rating: 4.7, reviewsCount: 26, sold: 53, stockQty: 18, installationAvailable: false, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80" },
    // Laptops - 10
    { name: "Dell Latitude 5530 - i5-1245U, 8GB, 256GB SSD, 15.6\"", slug: "dell-latitude-5530-i5-8gb", category: Category.ICT, price: 78000, oldPrice: 85000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 52, sold: 94, stockQty: 12, installationAvailable: false, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" },
    { name: "HP ProBook 450 G9 - i5-1235U, 8GB, 512GB SSD, 15.6\"", slug: "hp-probook-450g9-i5-8gb", category: Category.ICT, price: 72000, rating: 4.6, reviewsCount: 38, sold: 67, stockQty: 15, installationAvailable: false, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80" },
    { name: "Lenovo ThinkPad E14 Gen 4 - i7-1255U, 16GB, 512GB SSD", slug: "lenovo-thinkpad-e14gen4-i7-16gb", category: Category.ICT, price: 95000, oldPrice: 105000, featured: true, badge: "FEATURED", rating: 4.8, reviewsCount: 31, sold: 48, stockQty: 8, installationAvailable: false, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80" },
    { name: "ASUS VivoBook 15 - Ryzen 5 5500U, 8GB, 512GB SSD", slug: "asus-vivobook15-ryzen5-8gb", category: Category.ICT, price: 55000, oldPrice: 62000, featured: false, badge: "SALE", rating: 4.5, reviewsCount: 64, sold: 156, stockQty: 20, installationAvailable: false, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" },
    { name: "Acer Aspire 5 A515 - i5-1235U, 16GB, 512GB SSD, 15.6\"", slug: "acer-aspire5-a515-i5-16gb", category: Category.ICT, price: 62000, rating: 4.5, reviewsCount: 41, sold: 89, stockQty: 18, installationAvailable: false, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80" },
    { name: "Dell XPS 15 9520 - i7-12700H, 16GB, 512GB, 15.6\" OLED", slug: "dell-xps15-9520-i7-oled", category: Category.ICT, price: 165000, rating: 4.9, reviewsCount: 18, sold: 22, stockQty: 4, installationAvailable: false, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" },
    { name: "HP Pavilion 14 - i5-1235U, 8GB, 512GB SSD, 14\"", slug: "hp-pavilion14-i5-8gb", category: Category.ICT, price: 58000, rating: 4.6, reviewsCount: 47, sold: 112, stockQty: 16, installationAvailable: false, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80" },
    { name: "Lenovo IdeaPad 3 15ITL6 - i3-1115G4, 4GB, 256GB SSD", slug: "lenovo-ideapad3-15itl6-i3", category: Category.ICT, price: 35000, oldPrice: 42000, featured: false, badge: "BUDGET", rating: 4.3, reviewsCount: 78, sold: 234, stockQty: 25, installationAvailable: false, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80" },
    { name: "MacBook Air M2 - 8GB, 256GB SSD, 13.6\" Liquid Retina", slug: "macbook-air-m2-8gb-256gb", category: Category.ICT, price: 145000, featured: true, rating: 4.9, reviewsCount: 67, sold: 78, stockQty: 6, installationAvailable: false, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" },
    { name: "Lenovo ThinkPad L14 Gen 3 - Ryzen 5 PRO, 16GB, 256GB", slug: "lenovo-thinkpad-l14gen3-ryzen5", category: Category.ICT, price: 68000, rating: 4.6, reviewsCount: 24, sold: 41, stockQty: 10, installationAvailable: false, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80" },
    // Desktops - 5
    { name: "Dell OptiPlex 3000 SFF - i5-12500T, 8GB, 256GB SSD", slug: "dell-optiplex-3000-sff-i5", category: Category.ICT, price: 48000, rating: 4.6, reviewsCount: 33, sold: 56, stockQty: 14, installationAvailable: false, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80" },
    { name: "HP ProDesk 400 G8 SFF - i7-11700, 16GB, 512GB SSD", slug: "hp-prodesk-400g8-i7-16gb", category: Category.ICT, price: 72000, oldPrice: 82000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 21, sold: 34, stockQty: 8, installationAvailable: false, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80" },
    { name: "Lenovo ThinkCentre M70s Gen 3 - i5-12400, 8GB, 256GB", slug: "lenovo-thinkcentre-m70s-gen3-i5", category: Category.ICT, price: 52000, rating: 4.5, reviewsCount: 27, sold: 45, stockQty: 12, installationAvailable: false, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80" },
    { name: "Dell Inspiron 3910 Tower - i5-12400, 16GB, 512GB + RTX 3060", slug: "dell-inspiron-3910-rtx3060", category: Category.ICT, price: 95000, featured: false, badge: "NEW", rating: 4.7, reviewsCount: 15, sold: 22, stockQty: 6, installationAvailable: false, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80" },
    { name: "Apple Mac Mini M2 - 8GB, 256GB SSD", slug: "apple-mac-mini-m2-8gb", category: Category.ICT, price: 85000, rating: 4.8, reviewsCount: 31, sold: 44, stockQty: 8, installationAvailable: false, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80" },
    // Printers - 5
    { name: "HP LaserJet Pro M404dn - Mono Laser, Duplex, Network", slug: "hp-laserjet-m404dn", category: Category.ICT, price: 32000, oldPrice: 38000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 44, sold: 98, stockQty: 15, installationAvailable: false, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80" },
    { name: "HP Color LaserJet Pro M454dw - Color, Duplex, WiFi", slug: "hp-color-laserjet-m454dw", category: Category.ICT, price: 58000, rating: 4.6, reviewsCount: 28, sold: 45, stockQty: 10, installationAvailable: false, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80" },
    { name: "Brother DCP-L2550DW - Mono Laser, Scan, Copy, WiFi", slug: "brother-dcp-l2550dw", category: Category.ICT, price: 28500, featured: false, badge: "VALUE", rating: 4.5, reviewsCount: 52, sold: 134, stockQty: 20, installationAvailable: false, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80" },
    { name: "Epson EcoTank L3210 - Ink Tank, Print/Scan/Copy", slug: "epson-ecotank-l3210", category: Category.ICT, price: 24000, oldPrice: 28000, featured: false, badge: "SALE", rating: 4.4, reviewsCount: 67, sold: 189, stockQty: 25, installationAvailable: false, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80" },
    { name: "HP OfficeJet Pro 9010 - Ink, AIO, WiFi, Duplex", slug: "hp-officejet-pro-9010", category: Category.ICT, price: 22000, rating: 4.5, reviewsCount: 38, sold: 78, stockQty: 18, installationAvailable: false, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80" },
    // Peripherals - Keyboards & Mice - 5
    { name: "Logitech MK295 Wireless Keyboard + Mouse Combo", slug: "logitech-mk295-wireless-combo", category: Category.ICT, price: 3500, rating: 4.5, reviewsCount: 89, sold: 312, stockQty: 50, installationAvailable: false, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
    { name: "Logitech MK540 Advanced Wireless Keyboard + Mouse", slug: "logitech-mk540-advanced", category: Category.ICT, price: 5500, featured: true, badge: "HOT", rating: 4.6, reviewsCount: 62, sold: 187, stockQty: 35, installationAvailable: false, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
    { name: "HP USB Wired Keyboard + Mouse Combo 100", slug: "hp-usb-combo-100", category: Category.ICT, price: 2200, rating: 4.3, reviewsCount: 94, sold: 456, stockQty: 60, installationAvailable: false, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
    { name: "Logitech MX Master 3S Wireless Mouse - Quiet Clicks", slug: "logitech-mx-master-3s", category: Category.ICT, price: 9500, rating: 4.8, reviewsCount: 41, sold: 89, stockQty: 15, installationAvailable: false, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80" },
    { name: "Dell KB216 Wired Keyboard + MS116 Mouse Bundle", slug: "dell-kb216-ms116-bundle", category: Category.ICT, price: 2800, rating: 4.4, reviewsCount: 53, sold: 198, stockQty: 40, installationAvailable: false, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
    // Headsets & Webcams - 5
    { name: "Logitech H390 USB Headset - Noise Cancelling Mic", slug: "logitech-h390-headset", category: Category.ICT, price: 3200, rating: 4.5, reviewsCount: 78, sold: 234, stockQty: 40, installationAvailable: false, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=800&q=80" },
    { name: "Jabra Evolve2 40 USB-C Headset - ANC, MS Certified", slug: "jabra-evolve2-40-usb-c", category: Category.ICT, price: 8500, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 34, sold: 67, stockQty: 12, installationAvailable: false, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=800&q=80" },
    { name: "Logitech C920s HD Pro Webcam - Privacy Shutter", slug: "logitech-c920s-webcam", category: Category.ICT, price: 6500, rating: 4.6, reviewsCount: 56, sold: 145, stockQty: 20, installationAvailable: false, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=80" },
    { name: "HP USB Headset 200 - Stereo, Noise Cancelling Mic", slug: "hp-usb-headset-200", category: Category.ICT, price: 1800, rating: 4.3, reviewsCount: 92, sold: 378, stockQty: 50, installationAvailable: false, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=800&q=80" },
    { name: "Dell UltraSharp Webcam - 4K, HDR, AI Auto-Framing", slug: "dell-ultrasharp-webcam-4k", category: Category.ICT, price: 12500, rating: 4.8, reviewsCount: 19, sold: 28, stockQty: 8, installationAvailable: false, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=80" },
    // External Storage - 5
    { name: "Seagate One Touch 1TB External HDD - USB 3.0", slug: "seagate-one-touch-1tb", category: Category.ICT, price: 7500, rating: 4.5, reviewsCount: 68, sold: 213, stockQty: 30, installationAvailable: false, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80" },
    { name: "WD My Passport 2TB External HDD - USB 3.0, HW Encryption", slug: "wd-my-passport-2tb", category: Category.ICT, price: 10500, oldPrice: 12000, featured: true, badge: "SALE", rating: 4.6, reviewsCount: 54, sold: 156, stockQty: 22, installationAvailable: false, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80" },
    { name: "Samsung T7 Portable SSD 500GB - USB 3.2, 1050MB/s", slug: "samsung-t7-ssd-500gb", category: Category.ICT, price: 9500, rating: 4.8, reviewsCount: 72, sold: 189, stockQty: 18, installationAvailable: false, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80" },
    { name: "SanDisk Ultra Dual Drive Luxe USB-C 128GB", slug: "sandisk-dual-drive-luxe-128gb", category: Category.ICT, price: 2800, rating: 4.5, reviewsCount: 89, sold: 345, stockQty: 45, installationAvailable: false, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80" },
    { name: "Kingston DataTraveler 32GB USB 3.0 Flash Drive", slug: "kingston-datatraveler-32gb", category: Category.ICT, price: 850, rating: 4.4, reviewsCount: 134, sold: 567, stockQty: 80, installationAvailable: false, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80" },
    // UPS & Power - 5
    { name: "APC Back-UPS BX1100LI - 1100VA/660W Tower", slug: "apc-backups-bx1100li", category: Category.ICT, price: 18500, oldPrice: 21000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 56, sold: 134, stockQty: 20, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "APC Smart-UPS SMT1000IC - 1000VA/700W, SmartConnect", slug: "apc-smartups-smt1000ic", category: Category.ICT, price: 48000, rating: 4.8, reviewsCount: 23, sold: 34, stockQty: 8, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "CyberPower CP1500EPFCLCD - 1500VA/1000W PFC Sinewave", slug: "cyberpower-cp1500epfclcd", category: Category.ICT, price: 35000, rating: 4.7, reviewsCount: 19, sold: 28, stockQty: 10, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "APC Back-UPS BE650G2 - 650VA/360W Compact", slug: "apc-backups-be650g2", category: Category.ICT, price: 8500, rating: 4.5, reviewsCount: 82, sold: 267, stockQty: 30, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "Eaton 5P1500R - 1500VA/1120W Rackmount UPS", slug: "eaton-5p1500r-rackmount", category: Category.ICT, price: 62000, featured: false, badge: "NEW", rating: 4.8, reviewsCount: 11, sold: 15, stockQty: 5, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    // Networking & Connectivity - 5
    { name: "TP-Link Archer AX73 - WiFi 6 Router, 5400Mbps", slug: "tp-link-archer-ax73-wifi6", category: Category.ICT, price: 12500, oldPrice: 15000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 64, sold: 178, stockQty: 25, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "Ubiquiti UniFi Dream Router - WiFi 6, 4x4 MIMO", slug: "ubiquiti-unifi-dream-router", category: Category.ICT, price: 28000, rating: 4.8, reviewsCount: 31, sold: 56, stockQty: 12, installationAvailable: true, labourPrice: 3000, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "TP-Link TL-SG1016D - 16-Port Gigabit Desktop Switch", slug: "tp-link-tl-sg1016d-16port", category: Category.ICT, price: 6500, rating: 4.5, reviewsCount: 47, sold: 134, stockQty: 20, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "D-Link DWR-978 5G/LTE Router - Dual Band WiFi 6", slug: "dlink-dwr-978-5g-router", category: Category.ICT, price: 22000, rating: 4.6, reviewsCount: 18, sold: 34, stockQty: 10, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    { name: "Google Nest Wifi Pro - WiFi 6E, Mesh System 2-Pack", slug: "google-nest-wifi-pro-2pack", category: Category.ICT, price: 32000, featured: false, badge: "NEW", rating: 4.7, reviewsCount: 22, sold: 38, stockQty: 8, installationAvailable: false, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    // Docking Stations & Hubs - 5
    { name: "Dell WD19TB Thunderbolt Dock - 180W, Dual 4K", slug: "dell-wd19tb-thunderbolt-dock", category: Category.ICT, price: 28500, oldPrice: 32000, featured: true, badge: "HOT", rating: 4.7, reviewsCount: 38, sold: 67, stockQty: 10, installationAvailable: false, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80" },
    { name: "HP USB-C Dock G5 - 100W, Dual 4K Display", slug: "hp-usb-c-dock-g5", category: Category.ICT, price: 24000, rating: 4.6, reviewsCount: 29, sold: 45, stockQty: 12, installationAvailable: false, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80" },
    { name: "Anker PowerExpand 8-in-1 USB-C Hub - 4K HDMI, PD 100W", slug: "anker-powerexpand-8in1-usb-c", category: Category.ICT, price: 5500, rating: 4.5, reviewsCount: 72, sold: 234, stockQty: 25, installationAvailable: false, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80" },
    { name: "CalDigit TS4 Thunderbolt 4 Dock - 18 Ports, 98W PD", slug: "caldigit-ts4-thunderbolt4", category: Category.ICT, price: 42000, rating: 4.9, reviewsCount: 14, sold: 19, stockQty: 5, installationAvailable: false, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80" },
    { name: "Lenovo ThinkPad Universal USB-C Dock - 100W PD", slug: "lenovo-thinkpad-usbc-dock", category: Category.ICT, price: 15500, rating: 4.5, reviewsCount: 34, sold: 56, stockQty: 14, installationAvailable: false, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { image: (p as any).image },
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        oldPrice: p.oldPrice,
        featured: p.featured ?? false,
        badge: (p as any).badge ?? null,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        sold: p.sold,
        stockQty: p.stockQty,
        inStock: p.stockQty > 0,
        installationAvailable: p.installationAvailable,
        labourPrice: (p as any).labourPrice,
        image: (p as any).image,
        description: `${p.name} - Genuine, manufacturer warranty. Supply & install available countrywide. 5-year workmanship warranty.`,
        images: [(p as any).image],
        tags: [p.category, "Syntech", "Kenya"],
        specs: [
          { key: "Warranty", value: "5 Years Workmanship + Manufacturer" },
          { key: "Installation", value: p.installationAvailable ? "Available Same-Day in Nairobi" : "Product Only" },
        ],
      },
    });
  }

  // Blog posts — detailed, SEO-optimized (7 posts incl. Website, Graphic, AI)
  const blogPosts = [
    {
      title: "CCTV Installation Cost in Kenya 2026: Complete Price Guide (4CH to 32CH)",
      slug: "cctv-installation-cost-kenya-2026",
      excerpt: "Real 2026 pricing: 4CH from KES 28,500, 8CH from KES 52,000, 16CH from KES 115,000. Dome vs bullet, storage, labour & hidden costs explained.",
      content: `## Why 2026 CCTV Costs Vary So Much\nCCTV isn’t just “cameras + DVR”. In 2026, Kenyan quotes range from KES 28k (4CH home) to KES 350k+ (32CH enterprise) — and the difference is **spec, not just count**.\n\n### 1. The 5 Price Drivers\n- **Channels & Layout:** 4CH covers a 3-bed home (gate + veranda + living + backyard). 8CH adds perimeter + kitchen. 16CH is for malls, schools, factories.\n- **Resolution:** 2MP (1080p) is fine for homes. 5MP sees plates at 20m — essential for estates/gates. Adds ~30%.\n- **Storage:** 1TB ≈ 7 days for 4 cameras (H.265). 2TB ≈ 14 days for 8 cam. We size for *at least* 14 days — DCI requests footage after 1 week.\n- **Night Vision & AI:** IR 20m vs 40m, WDR for gates against sun, human/vehicle detection to cut false alerts.\n- **Labour & Warranty:** Cheapest quote often skips trunking, earthing, and 1-year warranty. Syntech does **5-year workmanship**, NCA/CAK, and labelled UTP.\n\n### 2. Real Syntech Pricing (Installed)\n| Kit | Spec | Price | Best For |\n| 4CH Bullet 1080p + 1TB | 4× bullet, 1TB, mobile app | **KES 28,500** | 2–3 bed, shop |\n| 8CH Dome 2MP + 2TB | 8× dome, 2TB, analytics | **KES 52,000** | Office, 4-bed maisonette |\n| 16CH 5MP + 4TB + Analytics | 16× 5MP, 4TB, line-cross | **KES 115,000** | Mini-mart, school |\n| PTZ 4MP 25× | Auto-track, 100m IR | **KES 68,000** | Gate, yard |\n\n*Includes mounting, configuration, app, training.*\n\n### 3. Hidden Costs to Ask About\nCable per metre (outdoor vs indoor), power supply (central vs individual), HDMI/monitor, internet for remote view, and **SLA**. Syntech includes 2-hour Nairobi response.\n\n### 4. How We Quote in 30 Minutes\nWe request: location (Google pin), front/back photos, power point, internet. Then we propose 2 options (budget vs best) with diagram. **Free site survey** within Nairobi.\n\n> **Syntech tip:** Don’t overbuy channels — buy resolution. A 4CH 5MP often beats 8CH 2MP for evidence.\n\n**Ready?** WhatsApp 0715 135 141 for a same-day diagram.`,
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
      tags: ["CCTV", "Security", "Kenya", "Cost Guide"],
      published: true,
      featured: true,
      seoTitle: "CCTV Installation Cost Kenya 2026: 4CH to 32CH Price Guide | Syntech",
      seoDescription: "CCTV installation cost Kenya 2026: 4CH KES 28,500, 8CH KES 52,000, 16CH KES 115,000. Dome vs bullet, storage, labour. Syntech 5-year warranty.",
    },
    {
      title: "Solar Backup for CCTV & Electric Fence: 3KVA vs 5KVA vs Lithium (Kenya Blackouts Guide)",
      slug: "solar-backup-cctv-electric-fence-blackouts",
      excerpt: "Blackouts = blind cameras. Compare 3KVA lead-acid vs 5KVA lithium, runtime maths, and Syntech’s auto-changeover kits from KES 85k.",
      content: `## Blackouts Shouldn’t Mean Blind\nKenya Power off = fence energizer off = cameras off — exactly when thieves test. Solar backup keeps CCTV + fence + 4 lights **8–18 hours**.\n\n### 1. Size Your Kit (Real Maths)\n- **Load:** 8× CCTV (80W) + DVR (20W) + fence (30W) + 4× 10W bulbs = ~170W continuous.\n- **Battery:** 2× 200Ah lead-acid = 2.4kWh usable (50% DoD) → 14h at 170W. Lithium 5kWh = 4.8kWh usable (96% DoD) → 28h, 10-year life.\n- **Panel:** 2× 550W = 1.1kW charge — refills lead-acid in 3h sun, lithium in 4h.\n\n### 2. Syntech Bundles (Installed)\n- **3KVA + 2×200Ah + 2×550W:** **KES 145,000** (SALE was 165k) — best for 4–8 cam homes. 2-year battery warranty.\n- **5KVA Hybrid + 5kWh Lithium:** **KES 285,000** — for 16+ cam, estate gatehouse, shop. 10-year lithium, app monitoring.\n- **550W Panel alone:** **KES 18,500** — add to existing.\n\n### 3. Lead-Acid vs Lithium?\nLead: cheap upfront, 2-year life, needs water/top-up. Lithium: 2× price, 10-year, zero maintenance, 2× runtime. **If fence is critical, go lithium.**\n\n### 4. Auto-Changeover & Install\nWe install ATS (20ms switch) + DB + earthing + county “cage”. 1–2 days, COC, 5-year workmanship.\n\n> **Syntech tip:** Don’t run solar backup on cheap modified-sine inverters — they kill DVRs. We use pure-sine hybrids.\n\n**Get a load audit:** WhatsApp your current bill + photo of DB — we size in 30 min.`,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
      tags: ["Solar", "Backup", "Power", "CCTV"],
      published: true,
      featured: true,
      seoTitle: "Solar Backup for CCTV & Fence Kenya 2026: 3KVA vs 5KVA | Syntech",
      seoDescription: "Solar backup Kenya: 3KVA KES 145k vs 5KVA lithium KES 285k for CCTV & fence. Runtime, lead vs lithium, install by Syntech.",
    },
    {
      title: "Website Design Cost in Kenya 2026: From KES 35k to Converts (Not Just Looks)",
      slug: "website-design-cost-kenya-2026",
      excerpt: "Why a KES 15k site costs you sales — and what a Syntech KES 35k sites deliver: SEO, M-Pesa, speed, and leads.",
      content: `## A Website Isn’t a Brochure — It’s a Sales Machine\nIn 2026, 83% of Nairobi clients Google you first. A slow, non-SEO site loses them in 3 seconds. Syntech sites load <2s, rank, and convert.\n\n### 1. What KES 35k Actually Includes\n- **Design:** Figma → Next.js/Tailwind, mobile-first, #0038A0/#F00000 Syntech system, not template.\n- **SEO:** Title/descriptions, sitemap.xml, robots.txt, JSON-LD (LocalBusiness + BlogPosting), OpenGraph, internal linking — we rank for “CCTV Nairobi”.\n- **Speed:** Image optimize, lazy, edge CDN — 95+ Lighthouse.\n- **Features:** M-Pesa STK, WhatsApp float (#25D366), shop/cart, blog CMS, admin.\n- **Growth:** Blog + analytics + ` + "`/sitemap.xml`" + ` for Google.\n\n### 2. Our Process (7–14 Days)\n1. Discovery (brand, competitors, keywords)\n2. Wireframe + copy\n3. Design + build + CMS\n4. SEO + speed + training\n5. Launch + 30-day support\n\n### 3. Graphic + AI Extras\nAdd **Graphic Design** (logos, social, packaging) from KES 8k and **AI** (chatbot, content, analytics) from KES 45k — one partner.\n\n> **Syntech tip:** Don’t buy a “cheap site + separate SEO” — SEO built-in from day one saves KES 80k later.\n\n**See our work:** syntech.co.ke + /blog — all managed by admin at /admin/blog.`,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      tags: ["Website Design", "SEO", "Kenya"],
      published: true,
      featured: true,
      seoTitle: "Website Design Cost Kenya 2026: From KES 35k | Syntech",
      seoDescription: "Website design Kenya 2026 from KES 35k: SEO, M-Pesa, speed 95+, blog. Syntech Syntech Solutions.",
    },
    {
      title: "Graphic Design That Sells in Kenya: Beyond a Pretty Logo (2026 Guide)",
      slug: "graphic-design-kenya-2026-guide",
      excerpt: "Logos from KES 8k that work on dust, matatu, and Instagram. Brand, not just art.",
      content: `## Good Design Isn’t Art — It’s Business\nA logo must survive **matatu dust, Instagram 1-inch, and invoice stamp**. Syntech’s 2026 system: #0038A0 primary, #F00000 accent, F5F7FA light — tested on shop signage.\n\n### 1. FKI Test\nWe test every logo: **F**avicon (16px), **K**iosk (3m banner), **I**nvoice (B&W). If it fails any, we redo.\n\n### 2. What You Get (From KES 8k)\n- Primary + secondary logo, palette (#0038A0/#0064D8/#F00000), typography (Inter), 3 mockups, brand sheet, social kit.\n- Files: SVG, PNG, PDF, favicon.\n\n### 3. Why It Converts\nWe pair graphic with **website + AI**: Your site uses same palette, and AI resizes posts for Instagram/X/LinkedIn in 1 click — admin-managed.\n\n> **Syntech tip:** Don’t pay for 10 concepts — pay for 2 great ones with strategy.\n\n**Need a rebrand?** WhatsApp 0715 135 141 — 48h first draft.`,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
      tags: ["Graphic Design", "Branding", "Kenya"],
      published: true,
      featured: true,
      seoTitle: "Graphic Design Kenya 2026: Logo Brand Guide | Syntech",
      seoDescription: "Graphic design Kenya from KES 8k: logo FKI test, brand palette #0038A0, Syntech.",
    },
    {
      title: "AI for Kenyan SMEs 2026: Chatbots & Automation That Actually Save KES (Not Hype)",
      slug: "ai-solutions-kenya-sme-2026",
      excerpt: "From KES 45k: AI that replies to CCTV quotes at 2am, drafts blog, and flags shoplifting — without monthly GPT bills.",
      content: `## AI Isn’t ChatGPT — It’s Your Night Shift\nKenyan SMEs lose leads at 9pm–6am. Syntech AI replies instantly, qualifies, and books site survey — then hands to human.\n\n### 1. What KES 45k Gets You\n- **WhatsApp Bot:** Answers “CCTV 4CH price?” with KES 28,500 + brochure + books survey. Human takeover in one tap.\n- **Blog AI:** Drafts 800-word SEO posts (like this) from admin prompt — you edit, publish at /admin/blog.\n- **Vision:** Flags “intruder” vs cat on your Dahua 16CH — reduces false alerts 80%.\n\n### 2. No Surprise Bills\nWe host on your Vercel Postgres, not $200/mo SaaS. One-time build + KES 5k/mo optional.\n\n### 3. Pair With Website + Graphic\nYour site (Next.js) + brand (#0038A0/#F00000) + AI = one Syntech stack. No 3 vendors.\n\n> **Syntech tip:** Start with one bot (CCTV quotes), not 5. Measure saved hours.\n\n**Demo:** Try the WhatsApp float on syntech.co.ke — that’s our bot.`,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      tags: ["AI", "Chatbot", "Automation", "Kenya"],
      published: true,
      featured: true,
      seoTitle: "AI Solutions Kenya 2026 for SMEs | Syntech",
      seoDescription: "AI solutions Kenya from KES 45k: WhatsApp bot, blog AI, vision. Syntech practical AI.",
    },
    {
      title: "Biometric Access vs Keys: Why Kenyan Offices Are Switching in 2026",
      slug: "biometric-access-vs-keys-kenya-2026",
      excerpt: "Fingerprint, face, card — 98% fewer tail-gating incidents and auditable logs. Here’s how to choose.",
      content: `## Keys Get Copied. Cards Get Shared. Biometrics Don’t.\nIn 2026, Nairobi offices lose KES 400k/year to “buddy punching”. ZKTeco F22 + face terminals cut it to zero — and give you **who, when, where**.\n\n### 1. F22 vs Face: Which?\n- **F22 (KES 18,500):** Finger + card, 1,000 users, TCP/IP, for 10–30 staff.\n- **SpeedFace V5L (KES 38,500):** Face + palm + mask, 3,000 users, for 50+ staff/reception.\n- **Terminal DS-K1T341A (KES 42,000):** Face + temp, for clinics/schools.\n\n### 2. Integration That Matters\nWe link to **payroll (time attendance)** + **CCTV (snapshot on entry)** + **turnstile** — one report.\n\n> **Syntech tip:** Don’t buy “face only” — buy face + finger backup for dusty sites.\n\n**From KES 18,500 installed** with mobile access. WhatsApp for payroll demo.`,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      tags: ["Biometrics", "Access Control"],
      published: true,
      featured: false,
      seoTitle: "Biometric Access Control Kenya 2026 | Syntech",
      seoDescription: "Biometric access control Kenya: F22, Face Terminal, why offices choose biometrics over keys.",
    },
    {
      title: "Estate Security: One Contract for 50–200 Homes (HOA Guide 2026)",
      slug: "estate-security-hoa-guide-kenya",
      excerpt: "How Kitengela & Syokimau estates save 35% with bulk CCTV, fence and gates — single SLA, one manager.",
      content: `## 87 Homes, 87 Quotes? No — One Contract.\nHOAs waste months collecting fundis. Syntech does **one site + one price + one SLA**.\n\n### 1. What’s Included (Per Home)\n- **Perimeter:** Druid 25 5J, 8km, battery + siren.\n- **Gate:** D5 Evo 500kg + safety beams + remotes.\n- **Entry:** 2× bullet + intercom 7” + F22.\n- **Core:** NVR + 1-month retention + app.\n\n### 2. Pricing & SLA\nFrom **KES 18,500/home** (50+ homes) — includes **4-hour emergency**, monthly health report, and 5-year fence warranty. **2,000+ homes** already.\n\n### 3. How It Works (6 Weeks for 87 Homes)\nWeek 1: Survey + HOA vote. Week 2–5: 3 teams parallel. Week 6: Handover + training.\n\n> **Syntech tip:** Insist on *one* manager, not 3 subs. We give you a named PM on WhatsApp.\n\n**Request bulk:** WhatsApp 0715 135 141 — we visit in 48h.`,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      tags: ["Estates", "HOA", "Gated Community"],
      published: true,
      featured: true,
      seoTitle: "Estate Security Kenya HOA Guide 2026 | Syntech",
      seoDescription: "Estate security for HOAs Kenya: bulk pricing, one contract, SLA for 50-200 homes. Syntech.",
    },
  ];

  for (const post of blogPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { title: post.title, excerpt: post.excerpt, content: post.content, image: post.image, published: post.published, featured: post.featured, seoTitle: post.seoTitle, seoDescription: post.seoDescription, tags: post.tags },
      create: { ...post, authorId: admin.id },
    });
  }

  console.log(`Seed done. Admin: ${admin.email} / Admin123! + ${blogPosts.length} posts`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
