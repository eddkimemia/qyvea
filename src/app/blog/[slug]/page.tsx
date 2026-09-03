import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

const FALLBACK: Record<string, any> = {
  "cctv-installation-cost-kenya-2026": {
    title: "CCTV Installation Cost in Kenya 2026: Complete Price Guide (4CH to 32CH)",
    excerpt: "Real 2026 pricing: 4CH from KES 28,500, 8CH from KES 52,000, 16CH from KES 115,000. Dome vs bullet, storage, labour & hidden costs. Syntech's expert breakdown for homes, offices & estates across Kenya.",
    content: "## Why 2026 CCTV Installation Costs Vary So Much in Kenya\n\nCCTV installation isn't just cameras + DVR anymore. In 2026, Kenya's security landscape has evolved dramatically — smart cameras with AI detection, cloud storage options, and mobile app monitoring are now standard. Your total cost depends on the number of channels, camera resolution, storage capacity, cabling type, and whether you need remote viewing.\n\n## Complete Price Breakdown: 4CH to 32CH Systems\n\n### 4-Channel System — KES 28,500 to KES 45,000\nIdeal for 3-bedroom homes, small shops, and kiosks. Includes 4 × 1080p dome cameras, 4CH DVR with 1TB hard drive, BNC cabling, power supply, and professional installation. Night vision up to 20m, motion detection, and mobile app viewing included.\n\n**What's included:**\n- 4 × 1080p Full HD dome cameras (IP66 weatherproof)\n- 4CH H.265+ DVR with 1TB surveillance HDD\n- 200m BNC cable + power connectors\n- 12V 5A power supply with battery backup slot\n- Professional installation & cable management\n- 5-year warranty on all equipment\n- Free site survey & consultation\n\n### 8-Channel System — KES 52,000 to KES 85,000\nThe sweet spot for medium businesses, larger homes, and apartment blocks. 8 cameras cover entrance, parking, perimeter, and key indoor areas. Options for 2MP, 4MP, or 5MP resolution.\n\n### 16-Channel System — KES 115,000 to KES 185,000\nFor warehouses, commercial buildings, and gated communities. Includes 16 × 4MP cameras, 16CH DVR/NVR with 4TB storage, and advanced analytics like people counting and line crossing detection.\n\n### 32-Channel System — KES 220,000 to KES 350,000+\nEnterprise-grade for factories, shopping malls, and large estates. 4K cameras, AI-powered analytics, centralized monitoring, and integration with access control and alarm systems.\n\n## Dome vs Bullet Cameras: Which Do You Need?\n\n**Dome cameras** are vandal-resistant (IK10 rated), discreet, and perfect for indoor areas, ceilings, and reception areas. They blend into the environment and are harder to tamper with.\n\n**Bullet cameras** have longer range (up to 50m night vision), are visible deterrents, and ideal for perimeters, parking lots, and outdoor areas where you want potential intruders to know they're being watched.\n\n**PTZ (Pan-Tilt-Zoom) cameras** offer 360° coverage with 20× optical zoom. Best for large open areas where you need to track movement. Starting from KES 35,000 per unit.\n\n## Hidden Costs Most Companies Don't Tell You About\n\n1. **Cable quality matters** — Cheap RG59 cable degrades signal after 100m. Syntech uses premium copper-core cable.\n2. **Power backup** — Load shedding means cameras go dark without UPS. Add KES 8,000–25,000 for battery backup.\n3. **Remote viewing setup** — Some companies charge extra for P2P cloud connectivity. We include it free.\n4. **Annual maintenance** — DVR firmware updates, camera cleaning, cable checks. Syntech includes first year free.\n5. **Warranty terms** — Read the fine print. Our 5-year warranty covers parts AND labour.\n\n## Why 500+ Kenyan Businesses Trust Syntech\n\n- **NCA, EPRA, PSRA licensed** — Fully compliant with Kenya's regulatory requirements\n- **Same-week installation** — From survey to live system in 5–7 working days\n- **47 counties served** — Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and everywhere in between\n- **5-year warranty** — Industry-leading coverage on all equipment and workmanship\n- **Free annual maintenance** — First year of maintenance check-ups included at no cost\n- **Mobile app monitoring** — Watch your cameras from anywhere via iOS/Android app\n\n## Get Your Free CCTV Survey Today\n\nEvery property is different. Our engineers will visit your site, assess vulnerabilities, and recommend the perfect system for your budget. No obligation, no pressure — just honest advice from Kenya's most trusted security company.\n\n**Call us:** " + SITE.phone + "\n**WhatsApp:** Instant quote in 30 minutes\n**Email:** " + SITE.email,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    tags: ["CCTV","Security","Kenya","Installation"],
    seoTitle: "CCTV Installation Cost Kenya 2026: 4CH to 32CH Complete Price Guide | Syntech Solutions",
    seoDescription: "CCTV installation cost Kenya 2026: 4CH from KES 28,500, 8CH from KES 52,000, 16CH from KES 115,000. Dome vs bullet cameras, hidden costs, storage options. Syntech 5-year warranty, 47 counties.",
    createdAt: new Date().toISOString(),
    views: 0
  },
  "solar-backup-cctv-electric-fence-blackouts": {
    title: "Solar Backup for CCTV & Electric Fence: 3KVA vs 5KVA vs Lithium (2026)",
    excerpt: "Kenya's blackouts mean blind cameras and open fences. Compare 3KVA lead-acid vs 5KVA lithium backup systems, runtime calculations, and Syntech pre-built kits from KES 85,000.",
    content: "## The Problem: Kenya's Load-Shedding Leaves You Vulnerable\n\nKenya experienced over 200 hours of unscheduled power outages in 2025, and the trend is worsening. When the grid goes down, your CCTV cameras go dark, electric fences lose their deterrent, and gate motors stop working. That's exactly when criminals strike.\n\n**The reality:** 73% of security breaches in Kenyan commercial properties happen during power outages. A solar backup system isn't a luxury — it's the backbone of reliable security.\n\n## 3KVA Lead-Acid vs 5KVA Lithium: The Full Comparison\n\n### 3KVA Lead-Acid System — KES 85,000 to KES 145,000\nThe budget-friendly workhorse. A 3KVA pure-sine inverter with 2 × 200Ah lead-acid batteries provides:\n\n- **8 × CCTV cameras:** 14–18 hours runtime\n- **Electric fence (8 zones):** 10–12 hours continuous\n- **Router + 2 APs:** Full overnight coverage\n- **Gate motor:** 50+ open/close cycles\n\n**Pros:** Affordable upfront, widely available, proven technology.\n**Cons:** Heavy (each battery = 60kg), 2–3 year battery lifespan, requires ventilation, 50% depth of discharge.\n\n### 5KVA Lithium System — KES 185,000 to KES 285,000\nThe premium choice for serious security. A 5KVA hybrid inverter with 1 × 5.12kWh LiFePO4 battery:\n\n- **16 × CCTV cameras:** 24–28 hours runtime\n- **Electric fence (16 zones):** 20+ hours continuous\n- **Full office:** computers, printers, lighting\n- **Gate + intercom:** unlimited cycles\n\n**Pros:** 80% lighter, 5–10 year lifespan, 80% depth of discharge, no maintenance, works in extreme heat.\n**Cons:** Higher upfront cost (but lower lifetime cost).\n\n## Runtime Calculation Formula\n\nTo estimate your backup time:\n\n**Runtime (hours) = (Battery Wh × 0.8) ÷ Total Load (W)**\n\nExample for a typical security setup:\n- 8 cameras × 12W = 96W\n- Electric fence controller = 30W\n- Router = 15W\n- **Total = 141W**\n\nWith 2 × 200Ah 12V lead-acid (4,800Wh usable at 50% DoD):\n- Runtime = 2,400Wh ÷ 141W = **17 hours** ✅\n\n## Syntech Pre-Built Backup Kits\n\n### Kit 1: Home Security Backup — KES 85,000\n3KVA inverter + 1 × 200Ah battery + installation. Covers 4 CCTV + fence + router.\n\n### Kit 2: Business Security Backup — KES 145,000\n3KVA inverter + 2 × 200Ah batteries + ATS + installation. Covers 8 CCTV + fence + office.\n\n### Kit 3: Enterprise Lithium — KES 285,000\n5KVA hybrid + 5.12kWh LiFePO4 + solar panels + installation. Covers 16+ CCTV + full facility.\n\nAll kits include:\n- Pure-sine wave inverter (protects sensitive equipment)\n- Automatic Transfer Switch (seamless switchover)\n- Professional installation & wiring\n- 5-year warranty on inverter, 3-year on batteries\n- Free load assessment & sizing consultation\n\n## Why Solar + Battery Is Better Than Generator\n\n| Feature | Solar + Battery | Diesel Generator |\n|---------|----------------|-------------------|\n| Running cost | Free (solar) | KES 80–150/hour |\n| Noise | Silent | 65–75 dB |\n| Maintenance | Zero | Weekly oil/service |\n| Lifespan | 10–15 years | 5–8 years |\n| Fumes | None | CO₂ + particulates |\n| Auto-start | Instant | 5–30 seconds |\n\n## Serving All 47 Counties\n\nSyntech has installed solar backup systems in Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika, Machakos, Kitengela, Syokimau, Ruiru, Kiambu, Nyeri, Meru, and 33 more counties. Our mobile engineering teams carry complete kits for same-day installation.\n\n**Ready to never lose security during a blackout?** Contact us for a free power audit and custom backup proposal.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    tags: ["Solar","Backup","Power","CCTV"],
    seoTitle: "Solar Backup for CCTV & Electric Fence Kenya 2026: 3KVA vs 5KVA Lithium | Syntech",
    seoDescription: "Solar backup Kenya 2026: 3KVA lead-acid vs 5KVA lithium for CCTV & electric fence. Runtime calculations, pre-built kits from KES 85k. Syntech 5-year warranty, 47 counties.",
    createdAt: new Date().toISOString(),
    views: 0
  },
  "website-design-cost-kenya-2026": {
    title: "Website Design Cost in Kenya 2026: From KES 35k to Websites That Actually Convert",
    excerpt: "Why a KES 15,000 website costs you sales — and what Syntech's KES 35,000 websites deliver: SEO, M-Pesa integration, mobile-first design, blazing speed, and lead generation that grows your business.",
    content: "## Why Most Kenyan Websites Don't Make Money\n\nHere's the uncomfortable truth: 80% of Kenyan business websites never generate a single lead. They're beautiful brochures that nobody finds, load too slowly on mobile, and have no clear path from visitor to customer.\n\nThe problem isn't design talent — it's that most web designers focus on how a site looks, not how it performs. A website is a sales machine. Every pixel, every load second, every word should move visitors closer to contacting you or making a purchase.\n\n## What Does Website Design Cost in Kenya in 2026?\n\n### Basic Website — KES 15,000 to KES 25,000\nA simple 5-page brochure site (Home, About, Services, Gallery, Contact). Suitable for professionals, consultants, and sole proprietors who just need an online presence.\n\n**What you typically get:**\n- 5 static pages with basic design\n- Mobile-responsive layout\n- Contact form\n- No SEO optimization\n- No speed optimization\n- Limited customization\n\n**The catch:** These sites often use generic templates, load in 4–8 seconds, and rank on page 5 of Google. You get what you pay for.\n\n### Professional Website — KES 35,000 to KES 75,000\nA conversion-focused website built for businesses serious about growth. This is where Syntech excels.\n\n**What Syntech delivers at KES 35,000:**\n- 10–15 custom-designed pages\n- Mobile-first, responsive design (looks perfect on every device)\n- Speed-optimized (loads in under 2 seconds)\n- SEO-optimized (meta tags, schema markup, sitemap)\n- M-Pesa payment integration\n- Contact forms with WhatsApp integration\n- Blog section for content marketing\n- Admin dashboard for easy updates\n- Google Analytics & Search Console setup\n- SSL certificate (HTTPS)\n- Social media integration\n\n### E-Commerce Website — KES 75,000 to KES 150,000\nFull online store with product catalog, shopping cart, M-Pesa/card checkout, inventory management, order tracking, and admin panel.\n\n### Enterprise / Custom Platform — KES 150,000+\nCustom web applications, portals, SaaS platforms, and enterprise systems built with modern tech stacks (Next.js, React, Node.js, PostgreSQL).\n\n## Why Syntech Websites Are Different\n\n### 1. Speed Is Everything\nEvery 1-second delay in page load reduces conversions by 7%. Our sites load in under 2 seconds because we optimize images, use CDN caching, and build with modern frameworks. Google also ranks faster sites higher.\n\n### 2. SEO Built In From Day One\nYour website should be found when people search \"CCTV installation Nairobi\" or \"solar panels Kenya.\" We implement:\n- Keyword-optimized page titles and meta descriptions\n- Schema.org structured data (helps Google understand your business)\n- XML sitemap and robots.txt\n- Internal linking strategy\n- Image alt tags and optimization\n- Core Web Vitals optimization\n\n### 3. M-Pesa Integration\nKenyans pay with M-Pesa. Every Syntech website includes STK Push integration so customers can pay directly from your site — no redirecting to a separate payment page.\n\n### 4. Mobile-First Design\nOver 85% of Kenyan internet users browse on mobile. We design for mobile first, then scale up to desktop. Your site looks and works perfectly on a KES 5,000 Android phone.\n\n### 5. Content Management System\nUpdate your own website without calling a developer. Our admin dashboard lets you edit text, add products, publish blog posts, and manage enquiries — all without touching code.\n\n## Graphic Design for Your Website\n\nYour website is only as good as the visuals on it. Syntech offers complete graphic design services including:\n\n- **Logo design** from KES 8,000 — professional logos that work on screens, print, and merchandise\n- **Brand identity packages** — color palette, typography, brand guidelines\n- **Social media graphics** — templates for Instagram, Facebook, LinkedIn, X\n- **Business cards, letterheads, flyers** — consistent brand across all touchpoints\n- **Product photography retouching** — professional images that sell\n\n## AI-Powered Features for Modern Websites\n\nIn 2026, AI isn't optional — it's expected. Syntech can integrate:\n\n- **AI chatbots** that answer customer questions 24/7 (from KES 45,000)\n- **AI content generation** for blog posts and product descriptions\n- **Smart product recommendations** based on visitor behavior\n- **Automated email sequences** triggered by visitor actions\n- **AI-powered analytics** that predict which leads will convert\n\n## Our Website Design Process\n\n1. **Discovery call** — We learn your business, goals, and target audience\n2. **Strategy document** — Sitemap, content plan, and SEO keyword research\n3. **Design mockups** — You see exactly how your site will look before we build\n4. **Development** — Clean, fast, secure code on modern frameworks\n5. **Content creation** — Professional copywriting and image sourcing\n6. **Testing** — Cross-browser, cross-device, speed, and security testing\n7. **Launch** — DNS setup, SSL, analytics, and search engine submission\n8. **Training** — We teach your team to manage the admin dashboard\n9. **Support** — 30 days free support, then affordable maintenance plans\n\n## Why Syntech? One Company for Everything\n\nMost businesses need a website AND security AND IT support. With Syntech, you get all of it from one trusted partner:\n\n- Website + CCTV + Biometrics + Solar + IT Support + Graphic Design + AI — all under one roof\n- Single point of contact, single invoice, single support number\n- We understand your physical security AND digital presence\n- 10+ years in business, 500+ projects, 47 counties served\n\n**Ready for a website that actually grows your business?** Contact us for a free consultation and custom proposal.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Website Design","SEO","Kenya","Web Development"],
    seoTitle: "Website Design Cost Kenya 2026: From KES 35k — SEO, M-Pesa, Speed | Syntech Solutions",
    seoDescription: "Website design cost Kenya 2026: Basic from KES 15k, professional from KES 35k, e-commerce from KES 75k. Syntech builds SEO-optimized, M-Pesa integrated, mobile-first websites that convert.",
    createdAt: new Date().toISOString(),
    views: 0
  },
  "graphic-design-kenya-2026-guide": {
    title: "Graphic Design That Sells in Kenya: Beyond a Pretty Logo (2026 Guide)",
    excerpt: "A logo from KES 8,000 that works on dust, matatu wraps, and Instagram. Syntech's complete branding guide for Kenyan businesses — from favicon to fleet graphics, brand identity to social media kits.",
    content: "## Why Most Logos Fail in Kenya\n\nWalk through any Kenyan market and you'll see beautiful logos printed on dusty banners, fading business cards, and pixelated social media profiles. The problem? Most designers create logos that look great on a bright screen but fall apart in the real world.\n\nA great logo must pass the FKI Test — it works as a **F**avicon (16×16 pixels), a **K**iosk sign (2 meters away), and on an **I**nvoice (black and white print). If your logo fails any of these, you need a redesign.\n\n## What Does Graphic Design Cost in Kenya in 2026?\n\n### Logo Design — KES 8,000 to KES 25,000\n- **Basic logo (KES 8,000):** 2 concepts, 1 revision, digital files (PNG, SVG, PDF)\n- **Professional logo (KES 15,000):** 4 concepts, 3 revisions, brand color palette, typography selection, full file package\n- **Premium brand mark (KES 25,000):** 6 concepts, unlimited revisions, complete brand guidelines, stationery mockups\n\n### Brand Identity Package — KES 25,000 to KES 65,000\nComplete visual identity system:\n- Primary and secondary logos\n- Brand color palette (primary, secondary, accent colors with HEX, RGB, CMYK codes)\n- Typography system (heading, body, accent fonts)\n- Brand guidelines document (how to use, how NOT to use)\n- Business card design\n- Letterhead and envelope\n- Invoice template\n- Social media profile kit (Facebook, Instagram, LinkedIn, X headers & profile pics)\n- Email signature design\n- Presentation template\n\n### Social Media Graphics Kit — KES 12,000 to KES 20,000\n- 30 Instagram post templates\n- 10 Instagram story templates\n- Facebook cover + post templates\n- LinkedIn banner + post templates\n- X (Twitter) header + post templates\n- WhatsApp status templates\n- Content calendar template\n\n### Marketing Collateral — KES 5,000 to KES 35,000\n- Business cards: from KES 3,000\n- Flyers & brochures: from KES 5,000\n- Roll-up banners: from KES 4,000\n- Vehicle wraps & fleet graphics: from KES 15,000\n- Signage & kiosk branding: from KES 8,000\n- Product packaging: from KES 12,000\n\n## The 5 Rules of Graphic Design for Kenyan Businesses\n\n### 1. Design for Dust and Sun\nKenyan businesses operate in harsh environments. Your sign will be in direct equatorial sun. Your banner will collect Nairobi dust. Design with high contrast, bold colors, and weatherproof materials.\n\n### 2. Mobile-First Everything\n85% of Kenyan consumers discover brands on their phones. Your social media graphics must look stunning on a 5.5-inch screen. No tiny text, no cluttered layouts.\n\n### 3. Consistency Is Trust\nWhen your logo, business card, website, social media, and vehicle all look like they belong to the same company, customers trust you. Inconsistent branding screams \"amateur.\"\n\n### 4. Tell a Story\nGreat design communicates without words. Your color palette evokes emotion. Your typography conveys personality. Your imagery tells your story.\n\n### 5. Think Beyond the Logo\nYour brand is the total experience — how your invoice looks, how your email signature reads, how your WhatsApp profile picture appears. Every touchpoint is branding.\n\n## Color Psychology for Kenyan Markets\n\n- **Blue (#0038A0):** Trust, security, professionalism — perfect for security, finance, and IT companies\n- **Red (#F00000):** Urgency, energy, power — ideal for sales, promotions, and emergency services\n- **Green:** Growth, nature, freshness — great for agriculture, eco, and health brands\n- **Gold/Yellow:** Premium, quality, warmth — suits hospitality, luxury, and high-end services\n- **Black & White:** Timeless elegance — works for fashion, law, and premium brands\n\n## AI Tools in Modern Graphic Design\n\nSyntech integrates AI into our design workflow:\n\n- **AI-powered logo generation** — Rapid concept exploration using machine learning\n- **Automated social media resizing** — One design, 10 platform-perfect versions instantly\n- **Color palette generation** — AI suggests harmonious palettes based on your industry\n- **Brand consistency checking** — AI scans all materials for brand compliance\n- **AI image generation** — Custom illustrations and mockups without stock photo limitations\n\n## Website Design Integration\n\nYour brand design must translate seamlessly to digital:\n\n- Responsive website layouts that maintain brand identity on every screen\n- Custom iconography matching your brand style\n- Web-optimized images for fast loading\n- Interactive elements (hover effects, animations) that reinforce brand personality\n- Email templates matching your brand guidelines\n\n## Why Choose Syntech for Graphic Design?\n\n- **Full-service company:** Logo → Website → CCTV → Solar → IT. One brand, one partner.\n- **Industry expertise:** We've designed for security, tech, hospitality, retail, and real estate\n- **Local understanding:** We know what works in Nairobi vs Mombasa vs rural Kenya\n- **Affordable packages:** Professional design from KES 8,000 — no \"white label\" markups\n- **Digital-first:** Every design includes digital-ready files for web and social media\n- **Print partnerships:** We work with trusted printers for business cards, banners, and signage\n\n## Ready to Build a Brand That Sells?\n\nEvery great business starts with a strong visual identity. Whether you need a logo, complete brand overhaul, or marketing materials, Syntech's creative team delivers designs that work in the real world.\n\n**Call us:** " + SITE.phone + "\n**WhatsApp:** Get a free brand consultation",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Graphic Design","Branding","Kenya","Logo Design"],
    seoTitle: "Graphic Design Kenya 2026: Logo, Brand Identity & Marketing | Syntech Solutions",
    seoDescription: "Graphic design Kenya 2026: Logos from KES 8k, brand identity from KES 25k, social media kits, signage. FKI test, color psychology, AI tools. Syntech creative studio.",
    createdAt: new Date().toISOString(),
    views: 0
  },
  "ai-solutions-kenya-sme-2026": {
    title: "AI for Kenyan SMEs 2026: Chatbots, Automation & Vision That Save Real KES",
    excerpt: "From KES 45,000: AI that replies to CCTV installation quotes at 2am, qualifies leads, drafts blog posts, monitors camera feeds for anomalies, and runs your customer service night shift.",
    content: "## AI Isn't Just ChatGPT — It's Your 24/7 Business Partner\n\nMost Kenyan business owners hear \"AI\" and think of chatbots that give robotic answers. In 2026, AI has evolved far beyond that. Modern AI solutions can monitor your CCTV feeds for suspicious activity, draft SEO blog posts about your services, qualify sales leads while you sleep, and handle customer WhatsApp enquiries with human-like understanding.\n\nThe question isn't whether Kenyan SMEs can afford AI — it's whether they can afford to compete without it.\n\n## Real AI Solutions for Kenyan Businesses\n\n### 1. WhatsApp & Website Chatbot — From KES 45,000\n**What it does:** An AI assistant that handles customer enquiries on WhatsApp and your website 24/7.\n\n**For a security company like Syntech:**\n- Customer asks: \"How much for 8-camera CCTV?\"\n- AI responds with pricing, features, and warranty details\n- AI captures the lead details (name, phone, location, requirement)\n- AI books the survey appointment in your calendar\n- You wake up to 3 qualified leads ready for follow-up\n\n**ROI:** One extra CCTV installation per month (KES 52,000+ revenue) pays for the AI 10× over.\n\n### 2. AI Content & Blog Writer — From KES 35,000\n**What it does:** Generates SEO-optimized blog posts, product descriptions, and social media content.\n\n**How Syntech uses it:**\n- \"Write a blog about CCTV costs in Kenya 2026\" → 2,500-word SEO article in 5 minutes\n- \"Create 10 Instagram posts about solar backup\" → 10 branded graphics with captions\n- \"Write product descriptions for 39 shop items\" → Complete catalog in 1 hour\n\n**The result:** Fresh content published weekly, higher Google rankings, more organic traffic without paying for ads.\n\n### 3. AI Camera Monitoring — From KES 65,000\n**What it does:** Computer vision that watches your CCTV feeds and detects unusual activity.\n\n**Capabilities:**\n- **People detection** — Alert when someone enters a restricted area after hours\n- **Face recognition** — Whitelist/blacklist known faces at your gate\n- **Object detection** — Alert when a vehicle is left in a no-parking zone\n- **Motion analytics** — Distinguish between a person, animal, and vehicle\n- **Crowd counting** — Monitor foot traffic in retail or event spaces\n- **Loitering detection** — Alert when someone lingers in sensitive areas\n\n**For estates and businesses:** Instead of a guard watching 16 screens (impossible), AI monitors all feeds simultaneously and alerts your security team only when something matters.\n\n### 4. AI-Powered CRM & Lead Scoring — From KES 55,000\n**What it does:** Automatically scores and ranks your sales leads based on likelihood to convert.\n\n**How it works:**\n- Lead comes in via WhatsApp, website, or phone\n- AI analyzes: budget signals, urgency, location, company size, previous interactions\n- Lead gets a score: Hot (85+), Warm (60–84), Cold (below 60)\n- Hot leads get immediate personal follow-up\n- Warm leads get automated nurture sequences\n- Cold leads get monthly newsletter\n\n**Result:** Your sales team focuses on leads that will actually close, not chasing dead ends.\n\n### 5. AI-Powered Cybersecurity — From KES 85,000\n**What it does:** Monitors your network for threats, phishing attempts, and vulnerabilities.\n\n**For businesses with IT infrastructure:**\n- Real-time threat detection across all network devices\n- Phishing email identification and quarantine\n- Vulnerability scanning and automated patching\n- Anomaly detection (unusual data transfers, login patterns)\n- Compliance reporting for ISO 9001:2015 requirements\n\n## How Much Does AI Cost for a Kenyan SME?\n\n| Solution | Setup Cost | Monthly Cost | Expected ROI |\n|----------|-----------|-------------|-------------|\n| WhatsApp Chatbot | KES 45,000 | KES 3,000 | 3–5× in 3 months |\n| Content AI | KES 35,000 | KES 2,500 | Saves 20+ hrs/month |\n| Camera AI | KES 65,000 | KES 4,000 | Reduces guard costs 40% |\n| Lead Scoring | KES 55,000 | KES 3,500 | Increases close rate 25% |\n| Cybersecurity AI | KES 85,000 | KES 5,000 | Prevents 1 breach = KES 500k+ saved |\n\n## Getting Started: The Syntech AI Roadmap\n\n### Phase 1: Foundation (Month 1)\n- Set up WhatsApp AI chatbot for immediate lead capture\n- Configure Google Analytics with AI-powered insights\n- Set up automated email sequences\n\n### Phase 2: Content (Month 2–3)\n- Deploy AI blog writer for weekly SEO content\n- Create social media content pipeline\n- Set up automated reporting dashboards\n\n### Phase 3: Intelligence (Month 3–6)\n- Integrate AI camera monitoring with existing CCTV\n- Deploy lead scoring and CRM automation\n- Add predictive analytics for inventory and scheduling\n\n## Why Syntech for AI Solutions?\n\n- **We understand your business** — Same company that installs your CCTV, builds your AI camera monitoring\n- **Local infrastructure** — AI hosted on regional servers for low latency\n- **Swahili support** — Chatbots that understand English and Swahili\n- **Integration experts** — AI that works with your existing systems (POS, CRM, WhatsApp Business)\n- **Measurable results** — We set KPIs from day one and show monthly ROI reports\n\n## Serving All 47 Counties\n\nFrom Nairobi startups to Mombasa hotels, Kisumu estates to Nakuru farms — AI solutions tailored to Kenyan businesses. Remote deployment available for most solutions. On-site setup in all major cities.\n\n**Ready to put AI to work for your business?** Contact us for a free AI readiness assessment.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    tags: ["AI","Chatbot","Automation","Kenya"],
    seoTitle: "AI Solutions Kenya 2026: Chatbots, Camera AI & Automation for SMEs | Syntech",
    seoDescription: "AI solutions Kenya 2026: WhatsApp chatbot from KES 45k, AI camera monitoring from KES 65k, content AI from KES 35k. Practical AI for Kenyan SMEs. Syntech.",
    createdAt: new Date().toISOString(),
    views: 0
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try { post = await prisma.post.findUnique({ where: { slug } }); } catch {}
  if (!post) post = (FALLBACK as any)[slug];
  if (!post) return { title: "Post not found" };
  return {
    title: post.seoTitle || `${post.title} | Syntech Blog`,
    description: post.seoDescription || post.excerpt,
    openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, images: post.image ? [post.image] : [], type: "article" },
    alternates: { canonical: `https://syntech.co.ke/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try {
    post = await prisma.post.findUnique({ where: { slug } });
    if (post) await prisma.post.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(()=>{});
  } catch {}
  if (!post) post = (FALLBACK as any)[slug];
  if (!post) return notFound();

  // Related products — by tag/category
  let relatedProducts: any[] = [];
  const tag = post.tags?.[0] || "CCTV";
  const catMap: Record<string,string> = { CCTV:"CCTV", Solar:"SOLAR", Website:"IT_SUPPORT", Graphic:"ACCESSORIES", AI:"IT_SUPPORT", Biometric:"BIOMETRICS", Estate:"ELECTRIC_FENCE" };
  let cat: string | null = null;
  for (const [k,v] of Object.entries(catMap)) if (tag.toLowerCase().includes(k.toLowerCase())) cat = v;
  try {
    if (cat) relatedProducts = await prisma.product.findMany({ where: { category: cat as any, active: true }, take: 3, orderBy: { sold: "desc" } });
    if (!relatedProducts.length) relatedProducts = await prisma.product.findMany({ where: { active: true }, take: 3, orderBy: { rating: "desc" } });
  } catch {}
  if (!relatedProducts.length) {
    // fallback mock
    relatedProducts = ([...MOCK_PRODUCTS] as any[]).filter(p => !cat || p.category===cat).slice(0,3);
    if (!relatedProducts.length) relatedProducts = ([...MOCK_PRODUCTS] as any[]).slice(0,3);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.image,
    author: { "@type": "Organization", name: "Syntech Solutions" },
    publisher: { "@type": "Organization", name: "Syntech Solutions", logo: { "@type": "ImageObject", url: "https://syntech.co.ke/syntechlogo.jpg" } },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog" className="text-sm text-[#0038A0] hover:underline">← Back to Blog</Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 mt-4">
        {/* Main */}
        <div>
          <div className="flex gap-2 flex-wrap">{post.tags?.map((t:string)=><Badge key={t} variant="secondary">{t}</Badge>)}<Badge className="bg-[#0038A0] text-white">Syntech</Badge></div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">{post.title}</h1>
          <p className="text-zinc-600 mt-3 text-lg">{post.excerpt}</p>
          <p className="text-xs text-zinc-400 mt-2">{new Date(post.createdAt).toLocaleDateString()} • {post.views || 0} views • Westlands, Nairobi • {Math.max(5, Math.ceil((post.content?.length || 500) / 1000))} min read</p>
          <div className="mt-6 rounded-2xl overflow-hidden border">
            <img src={post.image} alt={post.title} className="w-full h-auto max-h-[420px] object-cover" />
          </div>
          <Card className="mt-6">
            <CardContent className="p-6 prose prose-zinc max-w-none prose-headings:font-black prose-a:text-[#0038A0] prose-img:rounded-xl prose-img:border max-w-none">
              {(() => {
                const c = post.content || "";
                const isHtml = /<\/?[a-z][\s\S]*>/i.test(c);
                const html = isHtml ? c : c.replace(/\n/g, "<br />");
                return <div dangerouslySetInnerHTML={{ __html: html }} />;
              })()}
              <div className="not-prose mt-6 flex flex-wrap gap-2">
                <Link href="/shop"><Button>Shop Equipment</Button></Link>
                <Link href="/services/website-design"><Button variant="outline">Website Design</Button></Link>
                <Link href="/services/graphic-design"><Button variant="outline">Graphic Design</Button></Link>
                <Link href="/services/ai-solutions"><Button variant="outline">AI Solutions</Button></Link>
                <Link href="/#contact"><Button variant="outline">Get Free Quote</Button></Link>
              </div>
            </CardContent>
          </Card>
          <p className="text-xs text-zinc-400 mt-6">Managed by admin at <Link href="/admin/blog" className="underline">/admin/blog</Link> • SEO title: {post.seoTitle}</p>
        </div>

        {/* Sidebar — related products + CTA */}
        <aside className="space-y-6">
          <Card className="border-2 border-[#0038A0]/10 overflow-hidden">
            <div className="h-1 bg-[#0038A0]" />
            <CardHeader className="pb-2"><CardTitle className="text-base">Related Products</CardTitle><p className="text-xs text-zinc-500">For {post.tags?.[0] || "this topic"} — genuine, warranted</p></CardHeader>
            <CardContent className="space-y-3">
              {relatedProducts.map((p:any)=>(
                <Link key={p.id} href={`/shop/${p.slug}`} className="flex gap-3 p-2 rounded-xl hover:bg-[#F5F7FA] border border-transparent hover:border-[#0038A0]/10 transition">
                  <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover border" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold line-clamp-2 leading-tight">{p.name}</p>
                    <p className="text-xs text-[#0038A0] font-bold">KES {p.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
              <Link href="/shop" className="block"><Button variant="outline" size="sm" className="w-full">Browse Shop</Button></Link>
            </CardContent>
          </Card>

          <Card className="bg-[#002070] text-white border-0 overflow-hidden">
            <CardContent className="p-5">
              <h3 className="font-black text-lg">Need a Quote?</h3>
              <p className="text-sm text-zinc-300 mt-1">We reply in 30 minutes. CCTV, solar, websites, graphics, AI — one partner.</p>
              <a href={`https://wa.me/254715135141?text=${encodeURIComponent(`Hi Syntech! I read your blog: ${post.title} - https://syntech.co.ke/blog/${slug}. I need a quote.`)}`} target="_blank" className="block mt-3">
                <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">Chat on WhatsApp</Button>
              </a>
              <Link href="/#contact" className="block mt-2"><Button variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white hover:text-[#002070]">Get Free Quote</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">More Insights</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Link href="/blog/cctv-installation-cost-kenya-2026" className="block hover:text-[#0038A0] hover:underline">CCTV Cost Guide 2026 →</Link>
              <Link href="/blog/website-design-cost-kenya-2026" className="block hover:text-[#0038A0] hover:underline">Website Design Cost →</Link>
              <Link href="/blog/ai-solutions-kenya-sme-2026" className="block hover:text-[#0038A0] hover:underline">AI for SMEs →</Link>
              <Link href="/blog/graphic-design-kenya-2026-guide" className="block hover:text-[#0038A0] hover:underline">Graphic Design Guide →</Link>
              <Link href="/blog" className="block text-[#0038A0] font-semibold hover:underline">View all posts →</Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "cctv-installation-cost-kenya-2026" },
    { slug: "solar-backup-cctv-electric-fence-blackouts" },
    { slug: "website-design-cost-kenya-2026" },
    { slug: "graphic-design-kenya-2026-guide" },
    { slug: "ai-solutions-kenya-sme-2026" },
    { slug: "biometric-access-vs-keys-kenya-2026" },
    { slug: "estate-security-hoa-guide-kenya" },
  ];
}
