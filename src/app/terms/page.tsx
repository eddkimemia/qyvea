import { SITE } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Syntech Solutions Kenya",
  description: "Syntech Solutions terms of service — warranties, delivery, installation, and customer obligations.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight">Terms of Service</h1>
      <p className="text-sm text-zinc-500 mt-1">Effective Date: January 1, 2026 • Last Updated: January 1, 2026</p>

      <Card className="mt-6">
        <CardContent className="prose prose-zinc max-w-none prose-headings:font-black prose-a:text-[#0038A0]">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the Syntech Solutions website (<Link href="/">syntech.co.ke</Link>), products, and services. By accessing our website, placing an order, or using our services, you agree to these Terms.
          </p>

          <h2 className="text-lg font-bold mt-6">1. Services</h2>
          <p>Syntech Solutions provides security, IT, solar, and related installation services across Kenya. Our services include but are not limited to:</p>
          <ul>
            <li>CCTV surveillance installation and maintenance</li>
            <li>Biometric access control systems</li>
            <li>Electric fencing and perimeter security</li>
            <li>Automatic gate automation</li>
            <li>Fire alarm systems</li>
            <li>Networking and structured cabling</li>
            <li>Solar backup and installation</li>
            <li>Smart home automation</li>
            <li>Website design, graphic design, and AI solutions</li>
            <li>IT support and maintenance</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">2. Quotations and Pricing</h2>
          <ul>
            <li>All prices displayed on our website are in Kenya Shillings (KES) and are subject to change without notice.</li>
            <li>Quotations provided via forms, phone, or WhatsApp are valid for 30 days from the date of issue.</li>
            <li>Final pricing is confirmed after a site survey and may differ from initial estimates.</li>
            <li>Installation fees are billed separately from product costs unless explicitly included in the quote.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">3. Orders and Payment</h2>
          <ul>
            <li>Orders placed through our website or WhatsApp are subject to product availability.</li>
            <li>Payment terms are agreed upon per order. We accept M-Pesa, bank transfer, and other agreed methods.</li>
            <li>No payment is required at the time of placing an order online — we confirm availability and payment details before processing.</li>
            <li>Orders may be cancelled before installation or delivery without penalty.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">4. Delivery</h2>
          <ul>
            <li><strong>Nairobi:</strong> Free delivery on orders over KES 5,000. Standard delivery within 1–3 business days.</li>
            <li><strong>Outside Nairobi:</strong> Delivery from KES 300 depending on location. Estimated 3–7 business days.</li>
            <li><strong>Pickup:</strong> Free pickup from our Westlands office during business hours.</li>
            <li>Delivery times are estimates and not guaranteed. Syntech is not liable for delays caused by third-party couriers.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">5. Installation</h2>
          <ul>
            <li>Installation is provided by certified technicians with relevant NCA and EPRA certifications.</li>
            <li>Site survey is required before installation for accurate scoping and pricing.</li>
            <li>Installation timelines depend on scope: typically 1–3 days for standard installations.</li>
            <li>Client is responsible for providing site access, power supply, and necessary permissions (e.g., estate management approval).</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">6. Warranty</h2>
          <ul>
            <li><strong>Workmanship Warranty:</strong> Syntech provides a <strong>5-year warranty</strong> on all installation workmanship — industry-leading coverage.</li>
            <li><strong>Product Warranty:</strong> Manufacturer warranty applies to all products (typically 1–3 years depending on brand).</li>
            <li>Warranty covers defects in installation and workmanship. It does not cover damage from misuse, unauthorized modifications, power surges, or acts of nature.</li>
            <li>Warranty claims must be reported within 48 hours of discovering the issue.</li>
            <li>Warranty service includes on-site repair or replacement at Syntech&apos;s discretion.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">7. Returns and Refunds</h2>
          <ul>
            <li>Products may be returned within 14 days of delivery if unused and in original packaging.</li>
            <li>Installed products cannot be returned but are covered under warranty.</li>
            <li>Refunds are processed within 14 business days of approved return.</li>
            <li>Custom-ordered or special-order items are non-returnable.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">8. Liability</h2>
          <ul>
            <li>Syntech carries contractor&apos;s all-risk insurance of KES 50,000,000.</li>
            <li>Our liability is limited to the value of the products and services provided.</li>
            <li>We are not liable for indirect, incidental, or consequential damages.</li>
            <li>Force majeure events (natural disasters, government actions, etc.) may affect service delivery timelines.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">9. Customer Obligations</h2>
          <ul>
            <li>Provide accurate information for quotes, orders, and site surveys.</li>
            <li>Ensure site access and necessary permissions for installation.</li>
            <li>Follow care and maintenance guidelines provided at handover.</li>
            <li>Report issues or warranty claims promptly.</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">10. Intellectual Property</h2>
          <p>All content on this website — including text, images, logos, and design — is the property of Syntech Solutions Limited and protected by applicable intellectual property laws. You may not reproduce or distribute our content without written permission.</p>

          <h2 className="text-lg font-bold mt-6">11. Governing Law</h2>
          <p>These Terms are governed by the laws of the Republic of Kenya. Any disputes shall be subject to the exclusive jurisdiction of Kenyan courts.</p>

          <h2 className="text-lg font-bold mt-6">12. Changes to These Terms</h2>
          <p>We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of our website and services constitutes acceptance of the updated Terms.</p>

          <h2 className="text-lg font-bold mt-6">13. Contact</h2>
          <p>For questions about these Terms of Service:</p>
          <ul>
            <li><strong>Email:</strong> {SITE.email}</li>
            <li><strong>Phone:</strong> {SITE.phone}</li>
            <li><strong>Address:</strong> {SITE.address}, Westlands Tower, Nairobi — 00100</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/privacy" className="text-sm text-[#0038A0] hover:underline">View Privacy Policy →</Link>
      </div>
    </div>
  );
}
