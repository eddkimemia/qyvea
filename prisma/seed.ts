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

  // Services (mirror original site)
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

  // Blog posts — SEO ready
  const blogPosts = [
    {
      title: "CCTV Installation Cost in Kenya 2026: What Affects Your Quote?",
      slug: "cctv-installation-cost-kenya-2026",
      excerpt: "4CH vs 8CH vs 16CH, dome vs bullet, storage and labour — we break down real 2026 pricing for Nairobi homes & businesses.",
      content: `Planning CCTV in 2026? Costs depend on camera count, resolution (1080p vs 5MP), storage (1TB vs 4TB), night vision, and analytics.\n\n**Syntech tip:** For a 3-bedroom home, a 4CH 1080p kit + 1TB at KES 28,500 installed covers most needs. Businesses need 8CH+ with remote monitoring — from KES 52,000.\n\nWe offer same-week install, 5-year workmanship warranty, and free site survey across 47 counties. Get a quote in 30 minutes via WhatsApp.`,
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
      tags: ["CCTV", "Security", "Kenya"],
      published: true,
      featured: true,
      seoTitle: "CCTV Installation Cost Kenya 2026 | Syntech",
      seoDescription: "CCTV cost in Kenya 2026: 4CH, 8CH, 16CH pricing, what affects quotes, and Syntech’s 5-year warranty. Free site survey.",
    },
    {
      title: "Solar Backup for CCTV & Electric Fence: Stay Secure During Blackouts",
      slug: "solar-backup-cctv-electric-fence-blackouts",
      excerpt: "Keep your fence, cameras and lights on when Kenya Power goes off. 3KVA vs 5KVA kits explained.",
      content: `Blackouts shouldn’t mean black screens. A 3KVA inverter + 2x200Ah + 2x550W keeps 8 cameras, fence and lights for 8-12 hours.\n\n**Bundles from KES 85k** with auto-changeover and lithium options. Syntech designs for your load, installs in 1-3 days, and warrants 5 years.`,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
      tags: ["Solar", "Backup", "Power"],
      published: true,
      featured: true,
      seoTitle: "Solar Backup for CCTV & Fence Kenya | Syntech",
      seoDescription: "Solar backup kits Kenya: 3KVA & 5KVA for CCTV & fence, lithium vs lead-acid, prices and install by Syntech.",
    },
    {
      title: "Biometric Access vs Keys: Why Kenyan Offices Are Switching in 2026",
      slug: "biometric-access-vs-keys-kenya-2026",
      excerpt: "Fingerprint, face, card — 98% fewer tail-gating incidents and auditable logs. Here’s how to choose.",
      content: `Keys get copied. Cards get shared. Biometrics don’t. ZKTeco F22 + face terminals give you per-person logs, time attendance, and anti-passback.\n\n**From KES 18,500 installed** with mobile access. Syntech integrates with payroll and CCTV for one dashboard.`,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      tags: ["Biometrics", "Access Control"],
      published: true,
      featured: false,
      seoTitle: "Biometric Access Control Kenya 2026 | Syntech",
      seoDescription: "Biometric access control Kenya: F22, Face Terminal, why offices choose biometrics over keys.",
    },
    {
      title: "Estate Security: One Contract for 50–200 Homes (HOA Guide)",
      slug: "estate-security-hoa-guide-kenya",
      excerpt: "How Kitengela & Syokimau estates save 35% with bulk CCTV, fence and gates — single SLA, one manager.",
      content: `Managing 87 homes? One contract beats 87 quotes. Syntech offers per-unit pricing, 4-hour emergency SLA, and monthly health reports for HOAs.\n\n**15+ estates, 2,000+ homes** already secured. Request bulk pricing today.`,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      tags: ["Estates", "HOA", "Gated Community"],
      published: true,
      featured: true,
      seoTitle: "Estate Security Kenya HOA Guide | Syntech",
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
