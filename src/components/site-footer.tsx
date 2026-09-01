import Link from "next/link";
import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-[#7FAF25] bg-[#0A0A0A] text-zinc-300">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 font-black text-white text-lg">
            <div className="h-9 w-9 rounded-xl bg-[#7FAF25] text-black grid place-items-center shadow">Q</div> {SITE.name}
          </Link>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Kenya&apos;s trusted security & IT company. 10+ years, 500+ projects, 47 counties. Licensed & insured. 5-year warranty.
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            <Link href={`https://wa.me/${SITE.whatsapp}`} className="text-[#7FAF25] hover:underline font-medium">WhatsApp</Link>
            <Link href={`tel:${SITE.phone}`} className="hover:text-white underline">Call</Link>
            <Link href="https://instagram.com" className="hover:text-white underline">Instagram</Link>
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
          <p className="text-xs text-zinc-500 mt-4">© 2026 Qyvea Limited Kenya. All rights reserved.</p>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        <div className="container mx-auto px-4 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-[#7FAF25]">Privacy</Link>
          <Link href="/terms" className="hover:text-[#7FAF25]">Terms</Link>
          <span>NCA • EPRA • PSRA • ISO 9001:2015 • KES 50M All-Risk Cover</span>
        </div>
      </div>
    </footer>
  );
}
