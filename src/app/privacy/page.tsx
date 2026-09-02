import { SITE } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Syntech Solutions Kenya",
  description: "Syntech Solutions privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mt-1">Effective Date: January 1, 2026 • Last Updated: January 1, 2026</p>

      <Card className="mt-6">
        <CardContent className="prose prose-zinc max-w-none prose-headings:font-black prose-a:text-[#0038A0]">
          <p>
            Syntech Solutions Limited (&quot;Syntech&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <Link href="/">syntech.co.ke</Link>, use our services, or interact with us.
          </p>

          <h2 className="text-lg font-bold mt-6">1. Information We Collect</h2>
          <h3 className="text-base font-semibold">Personal Information</h3>
          <p>We may collect the following personal information when you:</p>
          <ul>
            <li>Submit a contact or quote request form (name, phone, email, location, service interest)</li>
            <li>Place an order through our shop (name, phone, email, delivery address, order details)</li>
            <li>Create an account (name, email, phone, password)</li>
            <li>Sign up as a partner or affiliate (name, email, phone, referral code)</li>
          </ul>

          <h3 className="text-base font-semibold">Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>Device information (browser type, operating system, device type)</li>
            <li>Usage data (pages visited, time spent, referral source)</li>
            <li>IP address and approximate location</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries, quote requests, and service enquiries</li>
            <li>Process and fulfil orders for products and services</li>
            <li>Provide customer support and after-sales service</li>
            <li>Send you updates about your orders, installations, and warranty</li>
            <li>Improve our website, products, and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Manage partner/affiliate relationships and commissions</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">3. Information Sharing</h2>
          <p>We do <strong>not</strong> sell your personal information to third parties. We may share your information with:</p>
          <ul>
            <li><strong>Service providers:</strong> Delivery partners, payment processors, and installation teams who assist in fulfilling your orders</li>
            <li><strong>Legal requirements:</strong> When required by law, regulation, or legal process</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">4. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal information, including:</p>
          <ul>
            <li>Encrypted data transmission (HTTPS/TLS)</li>
            <li>Secure database storage with strict access controls</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal data on a need-to-know basis</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">5. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to provide our services and fulfil the purposes described in this policy. Order and installation records are retained for a minimum of 5 years to support our warranty obligations.</p>

          <h2 className="text-lg font-bold mt-6">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Lodge a complaint with a relevant data protection authority</li>
          </ul>

          <h2 className="text-lg font-bold mt-6">7. Cookies</h2>
          <p>Our website uses essential cookies for session management and preferences. We do not use third-party advertising cookies. You can control cookie settings through your browser.</p>

          <h2 className="text-lg font-bold mt-6">8. Third-Party Links</h2>
          <p>Our website may contain links to third-party platforms (WhatsApp, social media, etc.). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>

          <h2 className="text-lg font-bold mt-6">9. Children&apos;s Privacy</h2>
          <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.</p>

          <h2 className="text-lg font-bold mt-6">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.</p>

          <h2 className="text-lg font-bold mt-6">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or how we handle your data, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> {SITE.email}</li>
            <li><strong>Phone:</strong> {SITE.phone}</li>
            <li><strong>Address:</strong> {SITE.address}, Westlands Tower, Nairobi — 00100</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/terms" className="text-sm text-[#0038A0] hover:underline">View Terms of Service →</Link>
      </div>
    </div>
  );
}
