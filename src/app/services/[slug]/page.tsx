import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { CheckCircle2, Clock, Shield, Star, Quote } from "lucide-react";

type ServiceData = {
  title: string;
  desc: string;
  longDesc: string;
  bullets: string[];
  process: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  testimonial: { quote: string; author: string; role: string };
  industries: string[];
  priceFrom: string;
  image: string;
};

const SERVICES: Record<string, ServiceData> = {
  cctv: {
    title: "CCTV Surveillance Systems Kenya",
    desc: "Professional CCTV, remote monitoring & analytics. Dome, bullet & PTZ cameras for homes, offices & estates.",
    longDesc: "Syntech designs, installs and maintains CCTV surveillance systems across Kenya. From 4-camera home kits to 32+ channel enterprise setups with AI analytics, we cover every security need. Our systems include Hikvision and Dahua cameras with H.265+ compression, IR night vision up to 50m, and mobile app viewing. Every installation comes with a 5-year workmanship warranty, free site survey, and same-day response in Nairobi. We've secured 500+ properties across 47 counties including homes, offices, warehouses, schools, and gated communities.",
    bullets: ["Site assessment & camera placement design", "Professional mounting & cable management", "DVR/NVR configuration & remote access setup", "Client training & handover documentation", "5-year workmanship warranty", "Free annual maintenance check"],
    process: [
      { step: "1", title: "Free Site Survey", desc: "Our engineer visits your property, identifies entry points, blind spots, and optimal camera positions. Takes photos and measurements." },
      { step: "2", title: "Custom Design & Quote", desc: "Within 24 hours you receive a detailed proposal with camera layout diagram, equipment list, and transparent pricing — no hidden costs." },
      { step: "3", title: "Professional Installation", desc: "Certified technicians install cameras, run cables through trunking, configure DVR/NVR, and set up mobile app viewing. Completed in 1–3 days." },
      { step: "4", title: "Training & Handover", desc: "We walk you through the system, show you remote viewing on your phone, and hand over all documentation including warranty certificates." },
    ],
    faqs: [
      { q: "How many cameras do I need for my home?", a: "A typical 3-bedroom home needs 4 cameras: gate/entry, veranda, living area, and backyard. Larger properties or those with multiple entry points may need 6–8 cameras." },
      { q: "Can I view cameras on my phone?", a: "Yes. Every Syntech CCTV system includes free P2P remote viewing via the Hik-Connect or DMSS app. View live feeds, playback recordings, and receive motion alerts from anywhere." },
      { q: "How long does footage last?", a: "With H.265+ compression: 1TB stores ~14 days for 4 cameras, 2TB stores ~14 days for 8 cameras. We recommend at least 14 days retention for security compliance." },
      { q: "Do you offer maintenance?", a: "Yes. We include the first year free. Annual maintenance packages start from KES 8,000 and cover camera cleaning, firmware updates, cable checks, and health reports." },
    ],
    testimonial: { quote: "32-camera CCTV installed in 2 days with zero disruption to our tenants. The remote monitoring on my phone is a game-changer.", author: "James Mutua", role: "Facilities Manager, Westlands Mall" },
    industries: ["Residential Estates", "Commercial Offices", "Warehouses & Factories", "Schools & Universities", "Hotels & Resorts", "Retail & Shopping Malls"],
    priceFrom: "KES 25,000",
    image: IMAGES.services.cctv,
  },
  biometrics: {
    title: "Biometric Access Control Systems",
    desc: "Fingerprint, face recognition & card access for offices, apartments & secure facilities in Kenya.",
    longDesc: "Syntech installs biometric access control systems that eliminate unauthorized entry and track attendance. Our solutions include ZKTeco and Hikvision terminals supporting fingerprint, face, palm, and RFID card authentication. Systems integrate with turnstiles, magnetic locks, and automatic gates. Perfect for offices needing time attendance, apartment buildings requiring tenant access, and high-security facilities demanding multi-factor authentication. All installations include training, integration with your existing security, and a 5-year warranty.",
    bullets: ["Fingerprint & face recognition readers", "RFID card & PIN backup access", "Turnstile & magnetic lock integration", "Time attendance & reporting dashboard", "Anti-passback & anti-tailgating", "Cloud or on-premise management"],
    process: [
      { step: "1", title: "Security Assessment", desc: "We evaluate your entry points, traffic flow, and security requirements to recommend the right biometric solution." },
      { step: "2", title: "System Design", desc: "Detailed proposal with reader placement, wiring diagram, and software configuration plan." },
      { step: "3", title: "Installation & Enrollment", desc: "Mount readers, wire connections, configure software, and enroll all users with fingerprints/faces." },
      { step: "4", title: "Training & Support", desc: "Admin training on the management dashboard, user enrollment, and report generation." },
    ],
    faqs: [
      { q: "What if someone's fingerprint doesn't read?", a: "All our systems support multiple authentication methods. If fingerprint fails, users can use face recognition, RFID card, or PIN as backup." },
      { q: "Can it track employee attendance?", a: "Yes. Our biometric systems include built-in time attendance with shift management, overtime tracking, and exportable reports for payroll integration." },
      { q: "How many users can the system handle?", a: "ZKTeco terminals support 3,000–50,000 fingerprints and 1,000–30,000 face templates depending on the model. We scale the system to your needs." },
    ],
    testimonial: { quote: "We went from key-based access to biometric in one day. No more lost keys, no more unauthorized entry.", author: "Sarah Wanjiku", role: "Office Manager, Nairobi CBD" },
    industries: ["Corporate Offices", "Government Buildings", "Apartment Complexes", "Banks & Financial", "Healthcare Facilities", "Educational Institutions"],
    priceFrom: "KES 18,000",
    image: IMAGES.services.biometric,
  },
  "electric-fence": {
    title: "Electric Fencing Kenya — Perimeter Security",
    desc: "Nemtek &/live wire electric fence installation with energizer, alarm & 24/7 monitoring.",
    longDesc: "Syntech provides end-to-end electric fencing solutions using Nemtek, a global leader in perimeter security. Our systems include high-voltage energizers, galvanized steel wire, insulators, warning signs, and integration with alarm systems and CCTV. Electric fences provide a visible and effective deterrent against intruders while being safe when properly installed. We handle residential properties, commercial compounds, warehouses, and estates with perimeter fencing from 50m to 5km+. Every installation includes county compliance, earthing, and a 5-year warranty.",
    bullets: ["Nemtek energizer with battery backup", "Galvanized steel wire & insulators", "Warning signs & compliance markers", "Siren, strobe & SMS alert integration", "CCTV cross-verification", "County compliance & earthing"],
    process: [
      { step: "1", title: "Perimeter Survey", desc: "We walk your fence line, measure distance, check terrain, and identify vulnerable points that need extra zones." },
      { step: "2", title: "System Design", desc: "Zone layout, energizer sizing, wire count, and alarm integration plan with full pricing." },
      { step: "3", title: "Installation", desc: "Post installation, wire strung, energizer mounted, earthing driven, signs posted. Typically 2–4 days depending on perimeter length." },
      { step: "4", title: "Commissioning & Training", desc: "Full system test, alarm response training, and handover with maintenance guide." },
    ],
    faqs: [
      { q: "Is electric fencing safe?", a: "Yes. Modern electric fences deliver a non-lethal shock that deters but doesn't injure. Warning signs are mandatory and installed on every installation." },
      { q: "Does it work during power outages?", a: "Yes. Our systems include battery backup that keeps the fence active for 8–24 hours during blackouts. Solar backup kits are also available." },
      { q: "How many zones do I need?", a: "Depends on perimeter length. A typical 200m perimeter uses 2–4 zones for easier fault detection. Larger properties may need 8+ zones." },
    ],
    testimonial: { quote: "Three attempted break-ins stopped in the first month. The alarm alerts my phone instantly. Best investment we made.", author: "Peter Kamau", role: "Home Owner, Kitengela" },
    industries: ["Residential Properties", "Warehouses & Yards", "Schools & Campuses", "Government Compounds", "Farms & Ranches", "Estates & HOAs"],
    priceFrom: "KES 45,000",
    image: IMAGES.products.energizer,
  },
  "automatic-gates": {
    title: "Automatic Gate Systems Kenya",
    desc: "Sliding & swing gate automation with remote, keypad, intercom & safety sensors.",
    longDesc: "Syntech automates manual gates into fully automatic systems using Centurion and Ditec motors. We install sliding gate motors, swing gate arms, barrier gates, and bollards with remote controls, keypads, intercom systems, and safety sensors. Whether you need a single residential gate or a commercial complex entry, we design systems that handle gate weights from 200kg to 3,000kg. Every installation includes safety beams, flashing lights, battery backup, and a 5-year warranty on motors.",
    bullets: ["Centurion & Ditec gate motors", "Remote, keypad & biometric access", "Video intercom integration", "Safety beams & flashing lights", "Battery backup for power outages", "5-year motor warranty"],
    process: [
      { step: "1", title: "Gate Assessment", desc: "We measure your gate dimensions, weight, swing radius or track length, and power availability." },
      { step: "2", title: "Motor Selection & Quote", desc: "Based on gate size and usage, we recommend the right motor and accessories with a detailed quote." },
      { step: "3", title: "Installation", desc: "Motor mounting, track/rack installation, wiring, remote programming, and safety beam setup. Usually completed in 1 day." },
      { step: "4", title: "Handover", desc: "We train you on remote operation, keypad programming, and emergency manual override." },
    ],
    faqs: [
      { q: "Can my existing gate be automated?", a: "Yes. 90% of existing gates can be automated without replacement. We assess the gate condition and recommend the right motor for your gate type and weight." },
      { q: "What happens during a power cut?", a: "All our installations include battery backup (24–72 hours of operation) and manual override key for emergencies." },
      { q: "How many remotes can I have?", a: "Centurion motors support up to 15 remotes. Additional remotes are available. We also offer keypad and biometric options." },
    ],
    testimonial: { quote: "Automatic gate was installed in half a day. The remote works perfectly and the safety beams give me peace of mind.", author: "Grace Muthoni", role: "Home Owner, Ruiru" },
    industries: ["Residential Homes", "Gated Communities", "Commercial Premises", "Industrial Parks", "Government Facilities", "Hotels & Resorts"],
    priceFrom: "KES 85,000",
    image: IMAGES.products.gate,
  },
  "fire-alarm-systems": {
    title: "Fire Alarm Systems Kenya — Compliance & Safety",
    desc: "Addressable & conventional fire detection, alarm panels, smoke detectors & compliance certificates.",
    longDesc: "Syntech designs and installs fire alarm systems that meet Kenya's fire safety regulations and international standards. We handle conventional and addressable fire panels, smoke and heat detectors, manual call points, sounders, beacons, and integration with sprinkler systems. Our installations come with compliance certificates required by county governments, fire departments, and insurance companies. From small offices to multi-story buildings, we ensure your property meets all fire safety requirements.",
    bullets: ["Addressable & conventional panels", "Smoke, heat & gas detectors", "Sounders, beacons & strobes", "Manual call points", "Sprinkler integration", "Compliance certificate"],
    process: [
      { step: "1", title: "Fire Risk Assessment", desc: "Our fire safety engineer evaluates your building layout, occupancy, and fire risks to design the right system." },
      { step: "2", title: "System Design", desc: "Detector placement, zone layout, panel location, and wiring plan with full compliance documentation." },
      { step: "3", title: "Installation", desc: "Panel mounting, detector installation, cable routing, and system wiring. Typically 3–7 days depending on building size." },
      { step: "4", title: "Testing & Certification", desc: "Full system test, county inspection coordination, and fire safety compliance certificate issuance." },
    ],
    faqs: [
      { q: "Do I need a fire alarm by law?", a: "Yes. Kenya's building codes require fire detection systems in commercial buildings, multi-story residential, schools, hospitals, and public assemblies. County governments enforce this." },
      { q: "What's the difference between addressable and conventional?", a: "Conventional systems identify which zone an alarm is in. Addressable systems pinpoint the exact detector. Addressable is recommended for larger buildings for faster response." },
      { q: "How often should the system be tested?", a: "Weekly visual checks, monthly functional tests, and annual professional servicing. We offer maintenance contracts that handle all testing and certification renewals." },
    ],
    testimonial: { quote: "Syntech handled everything from design to county certification. Our fire alarm passed inspection on the first attempt.", author: "David Ochieng", role: "Property Manager, Kisumu" },
    industries: ["Office Buildings", "Hotels & Hospitality", "Schools & Universities", "Hospitals & Clinics", "Shopping Malls", "Warehouses & Factories"],
    priceFrom: "KES 35,000",
    image: IMAGES.products.fire,
  },
  networking: {
    title: "Networking & Structured Cabling Kenya",
    desc: "LAN, fiber optic, WiFi, patch panels, server racks & structured cabling for offices & campuses.",
    longDesc: "Syntech provides complete networking infrastructure from structured cabling to WiFi deployment. We design and install Cat6/Cat6A copper networks, single-mode and multi-mode fiber, patch panels, server racks, and enterprise WiFi systems using Ubiquiti and TP-Link. Our structured cabling solutions are labeled, tested, and documented for easy troubleshooting. Whether you need a 10-point office LAN or a campus-wide fiber backbone, we deliver reliable, high-performance networks with proper cable management and compliance documentation.",
    bullets: ["Cat6/Cat6A & fiber optic cabling", "Patch panels, racks & cable management", "Ubiquiti & TP-Link WiFi deployment", "Network testing & certification", "Documentation & labeling", "5-year cabling warranty"],
    process: [
      { step: "1", title: "Network Assessment", desc: "We survey your space, count endpoints, check existing infrastructure, and understand your bandwidth requirements." },
      { step: "2", title: "Network Design", desc: "Cable routing plan, rack layout, WiFi heat map, and equipment selection with detailed quotation." },
      { step: "3", title: "Installation", desc: "Cable pulling through trunking/conduit, patch panel termination, rack mounting, and WiFi AP placement." },
      { step: "4", title: "Testing & Documentation", desc: "Every cable tested and certified, full network documentation, and training on the management dashboard." },
    ],
    faqs: [
      { q: "Cat6 or Cat6A — which do I need?", a: "Cat6 supports up to 1Gbps at 100m and is fine for most offices. Cat6A supports 10Gbps at 100m and is recommended for data centers or future-proofing." },
      { q: "How long does a typical office installation take?", a: "A 20–50 point office installation typically takes 2–4 days including cable pulling, termination, testing, and documentation." },
      { q: "Do you handle WiFi as well?", a: "Yes. We design WiFi coverage using heat mapping software, deploy enterprise access points, and configure VLANs, guest networks, and bandwidth management." },
    ],
    testimonial: { quote: "Complete office rewiring done over a weekend. Zero downtime on Monday. The labeling makes troubleshooting a breeze.", author: "Anne Wairimu", role: "IT Director, Nairobi Tech Hub" },
    industries: ["Corporate Offices", "Data Centers", "Schools & Campuses", "Hotels", "Hospitals", "Government Agencies"],
    priceFrom: "KES 15,000",
    image: IMAGES.services.networking,
  },
  "smart-home-automation": {
    title: "Smart Home Automation Kenya",
    desc: "Smart locks, lighting, curtains, voice control & app-based home automation systems.",
    longDesc: "Syntech transforms ordinary homes into intelligent living spaces with smart automation. We install smart door locks with fingerprint and app control, automated curtain motors, smart lighting with voice control via Alexa and Google Home, CCTV integration, and whole-home automation through Tuya and Zigbee platforms. Our systems let you control your home from your phone — anywhere in the world. Perfect for new builds and retrofits, with solutions starting from a single smart lock to full home automation packages.",
    bullets: ["Smart locks (fingerprint, PIN, app)", "Automated curtain motors", "Smart lighting & voice control", "CCTV & intercom integration", "Tuya/Zigbee/Google Home/Alexa", "Remote monitoring from anywhere"],
    process: [
      { step: "1", title: "Home Consultation", desc: "We visit your home, discuss your lifestyle needs, and identify which rooms and systems to automate." },
      { step: "2", title: "Solution Design", desc: "Device selection, placement plan, wiring requirements, and app configuration with full pricing." },
      { step: "3", title: "Installation", desc: "Device mounting, wiring, hub setup, WiFi configuration, and app pairing. Usually 1–2 days." },
      { step: "4", title: "Training & Support", desc: "We teach you and your family to use the system, set up voice commands, and configure automations." },
    ],
    faqs: [
      { q: "Do I need special wiring?", a: "Most smart devices work with your existing wiring. Smart switches replace standard switches. Battery-powered devices need no wiring at all." },
      { q: "What if my WiFi goes down?", a: "Zigbee and Z-Wave devices work on their own mesh network independent of WiFi. Smart locks and keypads always have local backup access." },
      { q: "Can I add devices gradually?", a: "Absolutely. Start with a smart lock or lighting, then add more devices over time. Our systems are designed to scale." },
    ],
    testimonial: { quote: "Controlling my curtains, lights, and door lock from my phone while in Mombasa — feels like the future is already here.", author: "Michael Odhiambo", role: "Home Owner, Karen" },
    industries: ["Luxury Villas", "Apartments", "Boutique Hotels", "Executive Offices", "Show Homes", "Airbnbs & Vacation Rentals"],
    priceFrom: "KES 40,000",
    image: IMAGES.services.smartHome,
  },
  "solar-installation": {
    title: "Solar Installation Kenya — On-Grid, Off-Grid & Hybrid",
    desc: "Complete solar power systems for homes, businesses & institutions. Net metering & county approvals.",
    longDesc: "Syntech designs and installs solar power systems ranging from 1KW residential setups to 100KW+ commercial installations. We handle on-grid, off-grid, and hybrid systems with Tier 1 solar panels, hybrid inverters, lithium and lead-acid batteries, and automatic transfer switches. Our installations include county approvals, KEPRRA compliance, and net metering setup where applicable. Every system is sized to your actual energy consumption with a guaranteed ROI analysis. We've installed solar across 47 counties with systems paying for themselves in 3–5 years.",
    bullets: ["Tier 1 monocrystalline panels", "Hybrid & pure sine wave inverters", "Lithium & lead-acid batteries", "Net metering & county approvals", "Remote monitoring via app", "25-year panel warranty"],
    process: [
      { step: "1", title: "Energy Audit", desc: "We analyze your electricity bills, identify your load profile, and determine the optimal system size." },
      { step: "2", title: "System Design", desc: "Panel layout, inverter sizing, battery bank calculation, and wiring diagram with financial projections." },
      { step: "3", title: "Installation", desc: "Mounting structure, panel installation, inverter/battery setup, wiring, and grid connection. 2–5 days." },
      { step: "4", title: "Commissioning", desc: "System testing, county inspection, net metering setup, monitoring app configuration, and training." },
    ],
    faqs: [
      { q: "How much can I save with solar?", a: "A typical 3KVA system saves KES 8,000–15,000 per month on electricity. Larger systems save proportionally more. Payback period is typically 3–5 years." },
      { q: "Does solar work during cloudy days?", a: "Yes. Modern panels generate 25–40% output on cloudy days. Battery backup stores energy for night-time and cloudy periods." },
      { q: "What about maintenance?", a: "Solar systems require minimal maintenance — panel cleaning twice a year and inverter check annually. We offer maintenance contracts." },
    ],
    testimonial: { quote: "Our electricity bill dropped from KES 45,000 to under KES 5,000. The system paid for itself in 3 years.", author: "Amina Kariuki", role: "Factory Owner, Thika" },
    industries: ["Residential Homes", "Commercial Buildings", "Factories & Warehouses", "Schools & Universities", "Hospitals", "Agricultural Operations"],
    priceFrom: "KES 95,000",
    image: IMAGES.services.solar,
  },
  "solar-solutions": {
    title: "Solar Backup Solutions Kenya",
    desc: "Keep CCTV, electric fence & lights running during blackouts. 3KVA to 10KVA kits.",
    longDesc: "Kenya experiences frequent power outages that leave security systems vulnerable. Syntech's solar backup solutions ensure your CCTV cameras, electric fence, gate motor, and essential lights stay powered 24/7. Our kits include pure sine wave inverters, deep-cycle batteries, solar panels, and automatic transfer switches. From 3KVA home kits covering 4 cameras and a fence to 10KVA enterprise systems covering entire facilities, we size backup to your specific security loads. Every kit includes professional installation, battery monitoring, and a 5-year warranty.",
    bullets: ["3KVA to 10KVA inverter kits", "Lithium & lead-acid battery options", "Automatic transfer switch", "Solar panel charging", "Remote battery monitoring", "5-year inverter warranty"],
    process: [
      { step: "1", title: "Load Assessment", desc: "We catalog every device you need backed up (cameras, fence, lights, router) and calculate total wattage and runtime needed." },
      { step: "2", title: "Kit Selection", desc: "Based on your load and desired runtime, we recommend the right inverter, battery bank, and panel configuration." },
      { step: "3", title: "Installation", desc: "Inverter mounting, battery setup, ATS installation, wiring to existing DB, and solar panel mounting. 1–2 days." },
      { step: "4", title: "Testing & Monitoring", desc: "Full load test, changeover timing verification, app monitoring setup, and handover training." },
    ],
    faqs: [
      { q: "How long will backup last during a blackout?", a: "A 3KVA system with 2×200Ah batteries runs 4 cameras + fence + router for 14–18 hours. A 5KVA lithium system runs 16+ cameras for 24+ hours." },
      { q: "Lead-acid or lithium?", a: "Lead-acid is cheaper upfront (KES 85k for 3KVA) but lasts 2–3 years. Lithium costs more (KES 185k for 5KVA) but lasts 10 years with zero maintenance. We recommend lithium for critical security." },
      { q: "Can it power my entire house?", a: "Our security backup kits focus on CCTV, fence, and lights. For full-home backup, see our Solar Installation service." },
    ],
    testimonial: { quote: "During the 8-hour blackout last month, our cameras never went dark. The fence stayed active. Best money we ever spent.", author: "Robert Mwangi", role: "Estate Manager, Syokimau" },
    industries: ["Residential Estates", "Commercial Properties", "Warehouses", "Schools", "Healthcare Facilities", "Telecom Towers"],
    priceFrom: "KES 85,000",
    image: IMAGES.services.solar,
  },
  "electrical-installation": {
    title: "Electrical Installation & Wiring Kenya",
    desc: "Professional wiring, distribution boards, earthing, EPRA compliance & certificates of compliance.",
    longDesc: "Syntech provides EPRA-compliant electrical installation services for new constructions, renovations, and upgrades. Our licensed electricians handle everything from domestic wiring and distribution board installation to industrial three-phase power, earthing systems, and lightning protection. Every installation comes with a Certificate of Compliance (COC) required by county governments and insurance companies. We use quality copper cable, Legrand/Schneider components, and ensure all work meets Kenya's electrical safety standards.",
    bullets: ["Domestic & commercial wiring", "Distribution boards & MCBs", "Earthing & lightning protection", "EPRA compliance & COC certificate", "Three-phase industrial power", "Energy-efficient LED upgrades"],
    process: [
      { step: "1", title: "Electrical Assessment", desc: "Survey of existing wiring, load requirements, and compliance gaps. For new builds, we review architectural plans." },
      { step: "2", title: "Design & Quote", desc: "Wiring layout, DB design, cable sizing, and component selection with transparent pricing." },
      { step: "3", title: "Installation", desc: "Cable pulling, DB installation, switch/socket mounting, earthing, and testing. Timeline depends on scope." },
      { step: "4", title: "Inspection & Certification", desc: "EPRA inspection coordination, testing, and COC certificate issuance." },
    ],
    faqs: [
      { q: "Do I need a COC for my house?", a: "Yes. A Certificate of Compliance is required for property transfers, insurance claims, and tenant agreements. County governments can fine non-compliant properties." },
      { q: "How often should wiring be checked?", a: "Every 5–10 years for residential, annually for commercial. Signs of problems include flickering lights, warm switch plates, and frequent breaker trips." },
      { q: "Can you upgrade my old wiring?", a: "Yes. We replace aluminum wiring with copper, upgrade old fuse boxes to modern MCBs, and add earth leakage protection. This is critical for safety." },
    ],
    testimonial: { quote: "Complete rewire of our 4-bedroom house. Passed county inspection first time. The COC was ready the same day.", author: "Faith Njeri", role: "Home Owner, Kiambu" },
    industries: ["Residential Homes", "Commercial Buildings", "Industrial Facilities", "Schools", "Healthcare", "Government Buildings"],
    priceFrom: "KES 12,000",
    image: IMAGES.products.electrical,
  },
  bms: {
    title: "Building Management System (BMS) Kenya",
    desc: "Centralized control for HVAC, lighting, access, CCTV & energy monitoring in large facilities.",
    longDesc: "Syntech implements Building Management Systems that unify all building operations into a single dashboard. Our BMS solutions integrate HVAC control, lighting automation, access control, CCTV monitoring, fire alarm systems, and energy metering. Designed for commercial buildings, hotels, hospitals, and large campuses, BMS reduces energy costs by 20–40%, improves occupant comfort, and enables predictive maintenance. We work with Honeywell, Siemens, and open-source BMS platforms to deliver solutions scaled to your facility.",
    bullets: ["HVAC & lighting control", "Access & CCTV integration", "Energy monitoring & reporting", "Single dashboard management", "Predictive maintenance alerts", "24/7 remote monitoring"],
    process: [
      { step: "1", title: "Facility Assessment", desc: "Comprehensive survey of all building systems, existing infrastructure, and operational requirements." },
      { step: "2", title: "System Architecture", desc: "Integration plan, protocol selection (BACnet/Modbus), dashboard design, and phased implementation roadmap." },
      { step: "3", title: "Implementation", desc: "Controller installation, sensor deployment, network setup, software configuration, and system integration." },
      { step: "4", title: "Commissioning & Training", desc: "Full system testing, operator training, documentation, and ongoing support SLA." },
    ],
    faqs: [
      { q: "What buildings need a BMS?", a: "Any building with multiple mechanical systems — HVAC, lighting, access control. Typically commercial buildings over 2,000 sqm, hotels, hospitals, and campuses." },
      { q: "How much energy can BMS save?", a: "Typically 20–40% reduction in energy costs through optimized HVAC scheduling, lighting automation, and load balancing." },
      { q: "Can BMS integrate with existing systems?", a: "Yes. We use open protocols (BACnet, Modbus, KNX) that integrate with most existing equipment from major manufacturers." },
    ],
    testimonial: { quote: "Energy costs dropped 30% in the first quarter after BMS installation. The dashboard gives us complete visibility.", author: "John Kimani", role: "Facilities Director, Nairobi Tower" },
    industries: ["Commercial Towers", "Hotels & Resorts", "Hospitals", "University Campuses", "Shopping Malls", "Government Complexes"],
    priceFrom: "KES 150,000",
    image: IMAGES.services.networking,
  },
  cybersecurity: {
    title: "Cybersecurity Services Kenya",
    desc: "Vulnerability audits, firewalls, endpoint protection & staff training for Kenyan businesses.",
    longDesc: "Syntech protects businesses from cyber threats with comprehensive cybersecurity solutions. We conduct vulnerability assessments, deploy enterprise firewalls and VPNs, install endpoint protection on all devices, and train staff to recognize phishing and social engineering attacks. Our services are tailored for Kenyan SMEs and enterprises, covering everything from basic antivirus to advanced threat detection and incident response. We partner with Fortinet, Sophos, and CrowdStrike to deliver enterprise-grade protection at SME-friendly prices.",
    bullets: ["Vulnerability & risk assessment", "Firewall & VPN deployment", "Endpoint protection (antivirus/EDR)", "Phishing simulation & training", "Incident response planning", "Compliance & audit support"],
    process: [
      { step: "1", title: "Security Audit", desc: "Comprehensive scan of your network, devices, and policies to identify vulnerabilities and risks." },
      { step: "2", title: "Protection Plan", desc: "Prioritized recommendations with product selection, implementation timeline, and budget." },
      { step: "3", title: "Deployment", desc: "Firewall installation, endpoint protection rollout, VPN setup, and policy configuration." },
      { step: "4", title: "Training & Monitoring", desc: "Staff security awareness training, ongoing monitoring, and quarterly vulnerability scans." },
    ],
    faqs: [
      { q: "How often should we do a security audit?", a: "Annually at minimum. After any major system change, new hire, or suspected breach, an immediate audit is recommended." },
      { q: "Do small businesses need cybersecurity?", a: "Yes. 43% of cyber attacks target small businesses. Basic protection (firewall + endpoint + training) starts from KES 20,000." },
      { q: "What's the most common threat in Kenya?", a: "Phishing emails and WhatsApp scams are the #1 threat. Staff training is the most cost-effective defense, starting from KES 8,000." },
    ],
    testimonial: { quote: "After a phishing attack nearly cost us KES 2M, Syntech secured our entire network in a week. No incidents since.", author: "Lucy Akinyi", role: "CFO, Nairobi Finance Ltd" },
    industries: ["Financial Services", "Healthcare", "Legal Firms", "Government", "E-Commerce", "Education"],
    priceFrom: "KES 20,000",
    image: IMAGES.hero.tech,
  },
  "system-integration": {
    title: "System Integration Kenya",
    desc: "Unify security, IT & power systems into one dashboard. CCTV + access + solar + networking.",
    longDesc: "Syntech integrates multiple building systems — CCTV, access control, electric fencing, solar backup, networking, and fire alarms — into a unified management platform. Instead of managing separate systems, you get one dashboard, one support contact, and one SLA. Our integration solutions use open APIs and middleware to connect systems from different manufacturers. This reduces operational costs, improves response times, and gives you complete visibility across all building systems.",
    bullets: ["Unified management dashboard", "Cross-system automation rules", "Single support SLA & contact", "Open API integration", "Incident correlation & alerts", "Scalable architecture"],
    process: [
      { step: "1", title: "Systems Inventory", desc: "We catalog all existing systems, their manufacturers, protocols, and integration capabilities." },
      { step: "2", title: "Integration Architecture", desc: "Middleware selection, API mapping, automation rules, and dashboard design." },
      { step: "3", title: "Implementation", desc: "API connections, middleware deployment, dashboard configuration, and rule testing." },
      { step: "4", title: "Training & Support", desc: "Operator training on the unified dashboard, troubleshooting procedures, and ongoing support." },
    ],
    faqs: [
      { q: "Can you integrate systems from different brands?", a: "Yes. We use open protocols and middleware that bridge different manufacturers. Hikvision CCTV + ZKTeco access + Nemtek fence all on one dashboard." },
      { q: "How long does integration take?", a: "Typically 2–4 weeks depending on the number of systems and complexity. We work in phases to minimize disruption." },
      { q: "What if we add new systems later?", a: "Our architecture is modular. New systems can be added with minimal reconfiguration. We provide ongoing integration support." },
    ],
    testimonial: { quote: "One dashboard controls our CCTV, access, fence, and solar. Response time to incidents dropped from 30 minutes to 2.", author: "Patrick Otieno", role: "Security Director, Mombasa Port Authority" },
    industries: ["Large Campuses", "Industrial Facilities", "Government Complexes", "Hotels & Resorts", "Hospitals", "Commercial Towers"],
    priceFrom: "KES 30,000",
    image: IMAGES.hero.server,
  },
  "it-support": {
    title: "IT Support & Managed Services Kenya",
    desc: "Helpdesk, server maintenance, backup, recovery & SLA-based IT support for SMEs.",
    longDesc: "Syntech provides proactive IT support that keeps your business running. Our managed services cover helpdesk support (phone, remote, on-site), server and network maintenance, data backup and disaster recovery, hardware procurement, and IT infrastructure management. We offer SLA-backed response times (2-hour for critical issues), monthly maintenance visits, and a dedicated account manager. From 5-device startups to 200-device enterprises, we scale our support to match your needs.",
    bullets: ["24/7 helpdesk (phone & remote)", "On-site support within 2 hours", "Server & network maintenance", "Data backup & disaster recovery", "Hardware procurement & setup", "Monthly IT health reports"],
    process: [
      { step: "1", title: "IT Assessment", desc: "Full audit of your IT infrastructure, inventory, pain points, and support requirements." },
      { step: "2", title: "Support Plan", desc: "Customized SLA, response times, visit frequency, and pricing based on your device count and needs." },
      { step: "3", title: "Onboarding", desc: "Remote access setup, asset documentation, backup configuration, and helpdesk integration." },
      { step: "4", title: "Ongoing Support", desc: "Proactive monitoring, scheduled maintenance, incident response, and quarterly reviews." },
    ],
    faqs: [
      { q: "What response time can I expect?", a: "Critical issues: 2-hour response. High priority: 4-hour. Standard: next business day. All backed by SLA with credits for missed targets." },
      { q: "Do you support Mac and Windows?", a: "Yes. We support Windows, macOS, Linux, and mixed environments. Our technicians are certified across platforms." },
      { q: "What's included in the monthly fee?", a: "Remote support, monthly on-site visit, patch management, backup monitoring, antivirus management, and IT health reports. Hardware costs are separate." },
    ],
    testimonial: { quote: "Switched from ad-hoc IT guy to Syntech managed services. Downtime dropped 80% and I finally have peace of mind.", author: "Wanjiru Mbugua", role: "Managing Director, Digital Marketing Agency" },
    industries: ["SMEs & Startups", "Professional Services", "Healthcare", "Education", "Retail", "Manufacturing"],
    priceFrom: "KES 8,000",
    image: IMAGES.services.maintenance,
  },
  "website-design": {
    title: "Website Design & Development Kenya",
    desc: "Modern, SEO-ready, M-Pesa integrated websites that convert visitors into paying customers.",
    longDesc: "Syntech builds websites that actually make money. We design and develop conversion-focused websites using Next.js, React, and modern frameworks — not WordPress templates. Every site includes mobile-first responsive design, SEO optimization (meta tags, schema markup, sitemap), M-Pesa payment integration, contact forms with WhatsApp integration, blog CMS, and Google Analytics. Our websites load in under 2 seconds, score 90+ on PageSpeed, and are built to rank on Google. From simple brochure sites to full e-commerce platforms, we deliver digital experiences that grow your business.",
    bullets: ["Custom design (no templates)", "Mobile-first responsive", "SEO + schema + sitemap", "M-Pesa & payment integration", "Blog CMS & admin dashboard", "Speed-optimized (<2s load)"],
    process: [
      { step: "1", title: "Strategy & Discovery", desc: "We learn your business, target audience, competitors, and goals. Deliverable: sitemap, content plan, wireframes." },
      { step: "2", title: "Design & Prototype", desc: "Figma mockups for every page. You approve the design before any code is written." },
      { step: "3", title: "Development", desc: "Clean, fast code on Next.js. M-Pesa integration, forms, CMS, analytics, and SEO setup." },
      { step: "4", title: "Launch & Training", desc: "DNS setup, SSL, speed optimization, Google submission, and admin training." },
    ],
    faqs: [
      { q: "How much does a website cost in Kenya?", a: "Basic brochure site: KES 15,000–25,000. Professional business site: KES 35,000–75,000. E-commerce: KES 75,000–150,000. Enterprise: KES 150,000+." },
      { q: "How long does it take?", a: "Basic site: 1–2 weeks. Professional site: 3–4 weeks. E-commerce: 4–6 weeks. Timeline depends on content readiness and feedback speed." },
      { q: "Do you do M-Pesa integration?", a: "Yes. Every e-commerce site includes STK Push M-Pesa integration so customers pay directly from your site. We also support card payments." },
    ],
    testimonial: { quote: "Our new website generated 47 leads in the first month — more than our old site got in a year. The M-Pesa integration is seamless.", author: "Alice Njoroge", role: "Founder, Nairobi Fashion Hub" },
    industries: ["E-Commerce", "Professional Services", "Real Estate", "Hospitality", "Healthcare", "Education"],
    priceFrom: "KES 35,000",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  "graphic-design": {
    title: "Graphic Design & Brand Identity Kenya",
    desc: "Logos, brand identity, social media kits & print design — FKI tested for Kenyan brands.",
    longDesc: "Syntech creates visual identities that work across every medium — from digital screens to dusty matatu wraps. Our design team specializes in logos that pass the FKI (Fimdi Kila Idhaa) test: recognizable at favicon size, on a vehicle wrap, and on an Instagram story. Services include logo design, complete brand identity packages, social media templates, business cards, letterheads, flyers, and product packaging. We design in Figma and deliver in all formats (SVG, PNG, PDF, PSD). Every project includes 3 concept options, 2 revision rounds, and full brand guidelines.",
    bullets: ["Logo design (3 concepts)", "Complete brand identity package", "Social media templates & kit", "Print materials (cards, flyers, banners)", "FKI-tested for all mediums", "Files: SVG/PNG/PDF/PSD"],
    process: [
      { step: "1", title: "Brand Brief", desc: "We learn your business, values, target audience, competitors, and design preferences through a structured questionnaire." },
      { step: "2", title: "Concept Development", desc: "3 unique logo concepts presented with mockups on business cards, websites, and social media." },
      { step: "3", title: "Refinement", desc: "You choose a direction. We refine it with 2 rounds of revisions until it's perfect." },
      { step: "4", title: "Brand Delivery", desc: "Full brand package: logo files (all formats), color palette, typography, brand guidelines PDF, and templates." },
    ],
    faqs: [
      { q: "How many logo concepts do I get?", a: "3 unique concepts from different creative directions. Each comes with mockups on real-world applications (cards, signs, social media)." },
      { q: "What's the FKI test?", a: "FKI (Fimdi Kila Idhaa) means 'found everywhere.' A good Kenyan logo must work at favicon size, on a dusty matatu, on an Instagram post, and on a billboard." },
      { q: "Do I own the logo?", a: "Yes. Full ownership transfers to you upon project completion. We provide original vector files and a copyright assignment letter." },
    ],
    testimonial: { quote: "Our new logo works perfectly on everything — our website, delivery trucks, and Instagram. Clients say it looks professional.", author: "Kevin Ouma", role: "CEO, Fresh Bites Kenya" },
    industries: ["Startups", "Restaurants & Food", "Fashion & Retail", "Tech Companies", "Real Estate", "Events & Entertainment"],
    priceFrom: "KES 8,000",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
  },
  "ai-solutions": {
    title: "AI Solutions for Kenyan Businesses",
    desc: "Chatbots, content automation, camera AI & analytics — practical AI hosted on your stack.",
    longDesc: "Syntech brings practical AI to Kenyan businesses — not hype, but solutions that save time and make money. Our AI services include WhatsApp chatbots that handle customer enquiries 24/7, content generation for blogs and social media, computer vision for CCTV analytics (people detection, face recognition, object tracking), lead scoring for sales teams, and cybersecurity threat detection. We build on open-source models and your own infrastructure — no expensive monthly GPT bills. Every solution comes with training, documentation, and ongoing support.",
    bullets: ["WhatsApp & website chatbots", "Content generation & blog AI", "CCTV computer vision analytics", "Lead scoring & CRM automation", "No monthly API costs (self-hosted)", "Staff training & documentation"],
    process: [
      { step: "1", title: "AI Readiness Assessment", desc: "We evaluate your data, processes, and identify where AI can deliver the highest ROI." },
      { step: "2", title: "Solution Design", desc: "AI model selection, integration plan, data requirements, and cost-benefit analysis." },
      { step: "3", title: "Development & Training", desc: "Model training, API development, integration with your systems, and testing." },
      { step: "4", title: "Deployment & Support", desc: "Production deployment, staff training, monitoring dashboard, and ongoing optimization." },
    ],
    faqs: [
      { q: "Do I need lots of data for AI?", a: "Not always. Pre-trained models can be fine-tuned with as few as 100 examples. We assess your data needs during the readiness assessment." },
      { q: "Is my data safe with AI?", a: "We deploy on your own infrastructure or private cloud. Your data never leaves your control. No third-party API calls for sensitive data." },
      { q: "What's the ROI of AI for a small business?", a: "A WhatsApp chatbot that captures 5 extra leads per month at KES 30,000 average deal value generates KES 150,000/month — 5× the cost of the AI solution." },
    ],
    testimonial: { quote: "Our AI chatbot handles 60% of customer enquiries automatically. Our sales team now focuses only on qualified leads.", author: "Daniel Wafula", role: "Sales Director, TechStart Kenya" },
    industries: ["E-Commerce", "Real Estate", "Healthcare", "Education", "Logistics", "Professional Services"],
    priceFrom: "KES 45,000",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  },
  maintenance: {
    title: "Maintenance & Repair Services Kenya",
    desc: "24/7 emergency support, preventive maintenance & repair for all security & IT systems.",
    longDesc: "Syntech provides 24/7 maintenance and repair services for all security, electrical, and IT systems — whether we installed them or not. Our maintenance contracts include preventive maintenance visits, emergency call-outs with 2-hour response in Nairobi/Mombasa/Kisumu, genuine spare parts, and detailed health reports. We maintain CCTV systems, electric fences, gate motors, fire alarms, solar systems, networking infrastructure, and IT equipment. Annual contracts start from KES 3,000/month and include priority response, discounted parts, and guaranteed SLAs.",
    bullets: ["24/7 emergency call-out", "2-hour response in major cities", "Preventive maintenance schedules", "Genuine spare parts in stock", "Detailed health reports", "Annual contracts from KES 3,000/mo"],
    process: [
      { step: "1", title: "System Registration", desc: "We register all your systems, note specifications, and create a maintenance schedule tailored to each system." },
      { step: "2", title: "Preventive Visits", desc: "Scheduled maintenance visits for cleaning, testing, firmware updates, and early problem detection." },
      { step: "3", title: "Emergency Response", desc: "When something breaks, call our 24/7 hotline. We dispatch a technician within 2 hours in major cities." },
      { step: "4", title: "Health Reports", desc: "Monthly or quarterly reports showing system status, issues resolved, and recommendations for upgrades." },
    ],
    faqs: [
      { q: "Do you maintain systems you didn't install?", a: "Yes. We maintain all brands and systems — Hikvision, Dahua, ZKTeco, Nemtek, Centurion, and more. We stock genuine parts for all major brands." },
      { q: "What's included in a maintenance contract?", a: "Scheduled preventive visits, emergency call-outs, spare parts at discounted rates, firmware updates, cleaning, testing, and monthly health reports." },
      { q: "How fast is emergency response?", a: "2-hour response in Nairobi, Mombasa, and Kisumu. 4-hour in other major towns. 24/7/365 availability including holidays." },
    ],
    testimonial: { quote: "Our CCTV went down at 11pm on a Saturday. Syntech had a technician on-site by 1am. That's the kind of support money can't buy.", author: "Patricia Njeri", role: "GM, Nairobi Hotel & Resort" },
    industries: ["All Industries", "Residential Estates", "Commercial Properties", "Industrial Facilities", "Government", "Healthcare"],
    priceFrom: "KES 3,000",
    image: IMAGES.services.maintenance,
  },
};

const SERVICE_CATEGORY_MAP: Record<string, string> = {
  cctv: "CCTV", biometrics: "BIOMETRICS", "electric-fence": "ELECTRIC_FENCE",
  "automatic-gates": "GATE_AUTOMATION", "fire-alarm-systems": "FIRE_ALARM",
  networking: "NETWORKING", "smart-home-automation": "SMART_HOME",
  "solar-installation": "SOLAR", "solar-solutions": "SOLAR",
  "electrical-installation": "ELECTRICAL", bms: "ACCESS_CONTROL",
  cybersecurity: "IT_SUPPORT", "system-integration": "IT_SUPPORT",
  "it-support": "IT_SUPPORT", "website-design": "IT_SUPPORT",
  "graphic-design": "ACCESSORIES", "ai-solutions": "IT_SUPPORT", maintenance: "ACCESSORIES",
};

export const dynamic = "force-dynamic";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = SERVICES[slug];
  if (!svc) return notFound();

  const category = SERVICE_CATEGORY_MAP[slug];
  let relatedProducts: any[] = [];
  if (category) {
    try {
      relatedProducts = await prisma.product.findMany({ where: { category: category as any, active: true }, take: 4, orderBy: { sold: "desc" } });
    } catch { relatedProducts = []; }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src={svc.image} alt={svc.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#002070]/80 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0038A0]" />
        <div className="relative p-6 md:p-10 max-w-3xl">
          <Badge className="bg-[#0038A0] text-white font-bold mb-3">SERVICE • CERTIFIED • WARRANTIED</Badge>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{svc.title}</h1>
          <p className="text-zinc-200 mt-3 leading-relaxed">Starting from <span className="text-[#0038A0] font-bold">{svc.priceFrom}</span>. Free site survey & quote.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`tel:${SITE.phone}`}><Button>Call {SITE.phone}</Button></Link>
            <Link href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I%20need%20${encodeURIComponent(svc.title)}`} target="_blank"><Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black backdrop-blur">WhatsApp Quote</Button></Link>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <Card className="mt-8 border-2 border-[#0038A0]/15">
        <div className="h-1 bg-[#0038A0]" />
        <CardContent className="p-6 md:p-8">
          <p className="text-zinc-700 leading-relaxed text-sm md:text-base">{svc.longDesc}</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {svc.industries.map((ind) => (
              <div key={ind} className="flex items-center gap-2 text-sm text-zinc-600">
                <CheckCircle2 className="h-4 w-4 text-[#0038A0] shrink-0" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What's Included + Pricing */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="border-2 border-[#0038A0]/20 overflow-hidden">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader><CardTitle>What&apos;s Included</CardTitle><p className="text-xs text-zinc-500 uppercase tracking-widest">Professional scope</p></CardHeader>
          <CardContent><ul className="space-y-2.5 text-sm text-zinc-700">{svc.bullets.map(b => <li key={b} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" />{b}</li>)}</ul></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pricing</CardTitle><p className="text-xs text-zinc-500 uppercase tracking-widest">Transparent • No hidden costs</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="border rounded-xl p-3 hover:border-[#0038A0]/30 transition"><p className="font-bold">Basic</p><p className="text-zinc-500 text-xs">Homes & shops</p><p className="font-bold mt-2 text-[#002070]">Call for Price</p></div>
              <div className="border-2 border-[#0038A0] rounded-xl p-3 bg-[#F5F7FA] shadow-sm"><p className="font-bold text-[#002070]">Business</p><p className="text-zinc-600 text-xs">Offices</p><p className="font-bold mt-2">Call for Price</p><Badge className="bg-[#0038A0] text-white text-[10px] mt-1">POPULAR</Badge></div>
              <div className="border rounded-xl p-3 hover:border-[#0038A0]/30 transition"><p className="font-bold">Enterprise</p><p className="text-zinc-500 text-xs">Large sites</p><p className="font-bold mt-2 text-[#002070]">Call for Price</p></div>
            </div>
            <Link href="/quote"><Button className="w-full">Get Custom Quote in 30min</Button></Link>
          </CardContent>
        </Card>
      </div>

      {/* How We Work */}
      <Card className="mt-6 overflow-hidden border-2 border-[#0038A0]/10">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>How We Work</CardTitle><p className="text-sm text-zinc-500">From first call to completed installation</p></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {svc.process.map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="mx-auto h-10 w-10 rounded-full bg-[#0038A0] text-white grid place-items-center font-black text-sm shadow">{step.step}</div>
                <h4 className="font-bold mt-3 text-sm">{step.title}</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonial */}
      <Card className="mt-6 bg-[#002070] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8 flex gap-4">
          <Quote className="h-8 w-8 text-[#0038A0] shrink-0 mt-1" />
          <div>
            <p className="text-lg leading-relaxed italic">&ldquo;{svc.testimonial.quote}&rdquo;</p>
            <p className="mt-3 text-sm text-zinc-300">— <span className="font-semibold text-white">{svc.testimonial.author}</span>, {svc.testimonial.role}</p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="mt-6 overflow-hidden border-2 border-[#0038A0]/10">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {svc.faqs.map((faq) => (
            <div key={faq.q} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
              <h4 className="font-semibold text-sm">{faq.q}</h4>
              <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Card className="mt-6 overflow-hidden border-2 border-[#0038A0]/10">
          <div className="h-1 bg-[#0038A0]" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Related Products</CardTitle>
                <p className="text-sm text-zinc-500">Genuine stock • Supply & install • 5-yr warranty</p>
              </div>
              <Link href={`/shop?category=${category}`} className="hidden sm:inline-flex text-sm font-semibold text-[#0038A0] hover:underline">View all →</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Form */}
      <Card className="mt-8 border-2 border-[#0038A0]/20 shadow-md" id="contact">
        <div className="h-1 bg-[#0038A0]" />
        <CardHeader><CardTitle>Get a Free Quote</CardTitle><p className="text-sm text-zinc-500">Free consultation & custom quote. We reply within 2 hours.</p></CardHeader>
        <CardContent>
          <form action="/api/leads" method="post" className="grid md:grid-cols-2 gap-3">
            <input name="name" placeholder="Full name *" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="phone" placeholder="Phone *" required className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input name="location" placeholder="Location (e.g., Westlands)" className="border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input type="hidden" name="service" value={slug.toUpperCase().replace(/-/g, "_")} />
            <textarea name="message" placeholder="Describe your site and requirements..." rows={3} className="md:col-span-2 border-2 border-zinc-200 focus:border-[#0038A0] rounded-lg px-3 py-2.5 text-sm outline-none" />
            <Button type="submit" className="md:col-span-2 h-11 text-base">Send Request — 2hr Reply</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(SERVICES).map(slug => ({ slug }));
}
