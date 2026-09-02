import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Phone } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.04 2C8.43 2 2.22 8.21 2.22 15.83c0 2.44.64 4.81 1.85 6.9L2.08 30l7.48-1.97a13.76 13.76 0 0 0 6.48 1.64h.01c7.61 0 13.82-6.21 13.82-13.83 0-3.7-1.44-7.17-4.05-9.78A13.75 13.75 0 0 0 16.04 2Zm7.93 19.8c-.33.95-1.95 1.84-2.71 1.96-.68.1-1.36.1-2.2-.1-.58-.14-1.33-.33-2.28-.65-4.02-1.72-6.64-5.74-6.84-6-.2-.27-1.66-2.21-1.66-4.22s1.05-3 1.43-3.41c.33-.36.87-.52 1.39-.52h1c.37 0 .69.02.99.83.33.95 1.14 3.28 1.24 3.52.1.24.16.52.02.83-.14.31-.21.5-.42.77-.2.27-.43.57-.61.77-.2.22-.41.46-.18.9.23.44 1.04 1.72 2.23 2.79 1.53 1.36 2.82 1.78 3.22 1.98.31.15.5.13.68-.08.19-.2.79-.92 1-1.22.21-.31.42-.26.71-.16.29.1 1.83.87 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.25 1.71Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.88-2.5 1 1 0 0 0-.07-.35 1 1 0 0 0 .07.35 2.89 2.89 0 0 0 2.88 2.5V12.5a5.53 5.53 0 0 0-2.88-.82 5.75 5.75 0 1 0 5.76 5.75V8.93a6.27 6.27 0 0 0 3.74 1.22V6.69h-.4Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-[#0038A0] bg-[#002070] text-zinc-300">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 font-black text-white text-lg">
            <img src="/syntechlogo.jpg" alt="Syntech Solutions" className="h-9 w-auto max-w-[160px] object-contain rounded-md bg-white p-1" />
          </Link>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Kenya&apos;s trusted security & IT company. 10+ years, 500+ projects, 47 counties. Licensed & insured. 5-year warranty.
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Link href="https://wa.me/254715135141" target="_blank" aria-label="WhatsApp" className="h-9 w-9 rounded-xl bg-[#25D366] text-white grid place-items-center hover:bg-[#20BD5A] transition">
              <WhatsAppIcon className="h-4 w-4" />
            </Link>
            <Link href="https://www.facebook.com/SyntechSolutions" target="_blank" aria-label="Facebook" className="h-9 w-9 rounded-xl bg-white text-[#1877F2] grid place-items-center hover:bg-zinc-100 transition">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://www.instagram.com/syntechsolutions" target="_blank" aria-label="Instagram" className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white grid place-items-center hover:opacity-90 transition">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="https://x.com/syntechsolutions" target="_blank" aria-label="X / Twitter" className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center hover:bg-zinc-100 transition">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="https://www.tiktok.com/@syntechsolutions" target="_blank" aria-label="TikTok" className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center hover:bg-zinc-100 transition">
              <TikTokIcon className="h-4 w-4" />
            </Link>
            <Link href="https://www.linkedin.com/company/syntech-solutions-ltd" target="_blank" aria-label="LinkedIn" className="h-9 w-9 rounded-xl bg-[#0A66C2] text-white grid place-items-center hover:bg-[#084482] transition">
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link href="https://www.youtube.com/@syntechsolutions" target="_blank" aria-label="YouTube" className="h-9 w-9 rounded-xl bg-[#FF0000] text-white grid place-items-center hover:bg-[#CC0000] transition">
              <Youtube className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-3 flex gap-3 text-xs">
            <Link href={`tel:${SITE.phone}`} className="inline-flex items-center gap-1 hover:text-[#0038A0]"><Phone className="h-3 w-3" /> {SITE.phone}</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/services/cctv" className="hover:text-white">CCTV</Link></li>
            <li><Link href="/estates" className="hover:text-white">Estate Solutions</Link></li>
            <li><Link href="#contact" className="hover:text-white">Free Consultation</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services/biometrics" className="hover:text-white">Biometrics</Link></li>
            <li><Link href="/services/electric-fence" className="hover:text-white">Electric Fence</Link></li>
            <li><Link href="/services/networking" className="hover:text-white">Networking</Link></li>
            <li><Link href="/services/solar-installation" className="hover:text-white">Solar</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <p className="text-sm"><Link href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phone}</Link></p>
          <p className="text-sm">{SITE.email}</p>
          <p className="text-sm">{SITE.address}</p>
          <p className="text-xs text-zinc-500 mt-4">© 2026 Syntech Limited Kenya. All rights reserved.</p>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        <div className="container mx-auto px-4 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-[#0038A0]">Privacy</Link>
          <Link href="/terms" className="hover:text-[#0038A0]">Terms</Link>
          <span>NCA • EPRA • PSRA • ISO 9001:2015 • KES 50M All-Risk Cover</span>
        </div>
      </div>
    </footer>
  );
}
