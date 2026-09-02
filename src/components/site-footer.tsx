import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin, Clock, Shield, CreditCard, MapPinned, Award, Wrench, Headphones } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/SyntechSolutions", fill: true },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/syntechsolutions", fill: false },
  { icon: XIcon, label: "X", href: "https://x.com/syntechsolutions", fill: false, custom: true },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/syntech-solutions-ltd", fill: true },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-[#0038A0] bg-[#002070] text-zinc-300">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1 — Brand & Social */}
        <div>
          <Link href="/" className="flex items-center gap-2 font-black text-white text-lg">
            <img src="/syntechlogo.jpg" alt="Syntech Solutions" className="h-9 w-auto max-w-[160px] object-contain rounded-md bg-white p-1" />
          </Link>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Kenya&apos;s #1 security & IT integration company. 10+ years of excellence, 500+ projects completed across all 47 counties. Licensed, insured, and backed by a 5-year warranty on every installation.
          </p>

          {/* Social Icons — uniform #0038A0 bg, white icons */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {SOCIAL_LINKS.map((s) => (
              <Link key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="h-9 w-9 rounded-xl bg-[#0038A0] text-white grid place-items-center hover:bg-[#0064D8] transition">
                {s.custom ? <s.icon className="h-4 w-4" /> : <s.icon className={`h-4 w-4${s.fill ? " fill-white" : ""}`} />}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex gap-3 text-xs">
            <Link href={`tel:${SITE.phone}`} className="inline-flex items-center gap-1 hover:text-white transition"><Phone className="h-3 w-3" /> {SITE.phone}</Link>
          </div>

          {/* Trust badges */}
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
            <Shield className="h-3 w-3 text-[#0038A0] shrink-0" />
            <span>NCA Licensed • EPRA Certified • PSRA Licensed</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
            <Award className="h-3 w-3 text-[#0038A0] shrink-0" />
            <span>ISO 9001:2015 Certified Quality</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
            <CreditCard className="h-3 w-3 text-[#0038A0] shrink-0" />
            <span>M-Pesa • Bank Transfer • Card Payments</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
            <Headphones className="h-3 w-3 text-[#0038A0] shrink-0" />
            <span>KES 50M All-Risk Insurance Cover</span>
          </div>
        </div>

        {/* Column 2 — Services */}
        <div>
          <h4 className="font-semibold text-white mb-3">Our Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services/cctv" className="hover:text-white transition">CCTV Installation</Link></li>
            <li><Link href="/services/biometrics" className="hover:text-white transition">Biometric Access Control</Link></li>
            <li><Link href="/services/electric-fence" className="hover:text-white transition">Electric Fencing</Link></li>
            <li><Link href="/services/automatic-gates" className="hover:text-white transition">Automatic Gates</Link></li>
            <li><Link href="/services/fire-alarm-systems" className="hover:text-white transition">Fire Alarm Systems</Link></li>
            <li><Link href="/services/networking" className="hover:text-white transition">Networking & Structured Cabling</Link></li>
            <li><Link href="/services/solar-installation" className="hover:text-white transition">Solar Installation</Link></li>
            <li><Link href="/services/solar-solutions" className="hover:text-white transition">Solar Backup Solutions</Link></li>
            <li><Link href="/services/smart-home-automation" className="hover:text-white transition">Smart Home Automation</Link></li>
            <li><Link href="/services/it-support" className="hover:text-white transition">IT Support & Helpdesk</Link></li>
            <li><Link href="/services/cybersecurity" className="hover:text-white transition">Cybersecurity</Link></li>
            <li><Link href="/services/website-design" className="hover:text-white transition">Website Design & Development</Link></li>
            <li><Link href="/services/graphic-design" className="hover:text-white transition">Graphic Design & Branding</Link></li>
            <li><Link href="/services/ai-solutions" className="hover:text-white transition">AI Solutions & Chatbots</Link></li>
            <li><Link href="/services/electrical-installation" className="hover:text-white transition">Electrical Installation</Link></li>
            <li><Link href="/services/system-integration" className="hover:text-white transition">System Integration</Link></li>
            <li><Link href="/services/maintenance" className="hover:text-white transition">Maintenance & Repair</Link></li>
          </ul>
        </div>

        {/* Column 3 — Company & Areas */}
        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Blog & Insights</Link></li>
            <li><Link href="/shop" className="hover:text-white transition">Shop Products</Link></li>
            <li><Link href="/estates" className="hover:text-white transition">Estate Solutions</Link></li>
            <li><Link href="/partners" className="hover:text-white transition">Partner Program</Link></li>
            <li><Link href="/clients" className="hover:text-white transition">Clients Portal</Link></li>
            <li><Link href="/#contact" className="hover:text-white transition">Free Consultation</Link></li>
          </ul>
          <h4 className="font-semibold text-white mb-3 mt-6">Service Areas — 47 Counties</h4>
          <div className="flex items-start gap-2 text-sm">
            <MapPinned className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" />
            <p>Nairobi • Mombasa • Kisumu • Nakuru • Eldoret • Thika • Machakos • Kitengela • Syokimau • Ruiru • Kiambu • Nyeri • Meru + 35 more counties across Kenya</p>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="font-semibold text-white text-xs flex items-center gap-1"><Wrench className="h-3 w-3" /> 5-Year Warranty</p>
            <p className="text-xs text-zinc-400 mt-1">Every installation backed by our industry-leading 5-year warranty. Free annual maintenance check included.</p>
          </div>
        </div>

        {/* Column 4 — Contact */}
        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <div className="space-y-2.5 text-sm">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#0038A0] shrink-0" /><Link href={`tel:${SITE.phone}`} className="hover:text-white transition">{SITE.phone}</Link></p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#0038A0] shrink-0" /><Link href="tel:+254715135141" className="hover:text-white transition">0715 135 141</Link></p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#0038A0] shrink-0" />{SITE.email}</p>
            <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-[#0038A0] mt-0.5 shrink-0" />{SITE.address}, Westlands Tower, Nairobi — 00100, Kenya</p>
            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="font-semibold text-white text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Business Hours</p>
              <p className="text-xs text-zinc-400">Mon–Fri: 8:00 AM – 6:00 PM</p>
              <p className="text-xs text-zinc-400">Sat: 9:00 AM – 1:00 PM</p>
              <p className="text-xs text-zinc-400">Sun & Holidays: Closed</p>
              <p className="text-xs text-[#F00000] font-semibold mt-1">🚨 Emergency: 24/7 Support Line</p>
            </div>
            <a href={`https://wa.me/${SITE.whatsapp}?text=Hi%20Syntech!%20I%20need%20a%20quote.`} target="_blank" className="block">
              <div className="p-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 text-center text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/30 transition">
                💬 Chat on WhatsApp — Instant Reply
              </div>
            </a>
          </div>
          <p className="text-xs text-zinc-500 mt-4">© 2026 Syntech Solutions Ltd Kenya. All rights reserved. Reg. No. PVT-2022-XXXXX</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
          <Link href="/privacy" className="hover:text-[#0038A0] transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#0038A0] transition">Terms of Service</Link>
          <Link href="/blog" className="hover:text-[#0038A0] transition">Blog</Link>
          <Link href="/partners" className="hover:text-[#0038A0] transition">Partners</Link>
          <Link href="/clients" className="hover:text-[#0038A0] transition">Client Portal</Link>
          <span className="hidden sm:inline">•</span>
          <span>NCA Licensed • EPRA Certified • PSRA Licensed • ISO 9001:2015 • KES 50M All-Risk Insurance • 5-Year Warranty</span>
        </div>
      </div>
    </footer>
  );
}
