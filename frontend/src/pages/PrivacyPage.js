import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div data-testid="privacy-page" className="bg-gray-50 min-h-screen">
      <section className="py-16 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-8 md:p-12 prose prose-gray max-w-none">
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul>
                <li>Contact information (name, email, phone number)</li>
                <li>Business information (for dealer applications)</li>
                <li>Employment information (for job applications)</li>
                <li>Product inquiries and feedback</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process dealer and job applications</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Send product updates and agricultural tips (with consent)</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
              <ul>
                <li>Service providers who assist in our operations</li>
                <li>Government authorities when required by law</li>
                <li>Business partners for fulfilling orders (with consent)</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

              <h2>5. Data Retention</h2>
              <p>We retain personal information for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.</p>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2>7. Cookies</h2>
              <p>Our website may use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>

              <h2>8. Children's Privacy</h2>
              <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.</p>

              <h2>9. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

              <h2>10. Contact Us</h2>
              <p>For privacy-related inquiries, please contact:</p>
              <p>
                Data Protection Officer<br />
                Avantra Chemicals Pvt Ltd<br />
                No.5, RKM Street, Halasuru<br />
                Bengaluru - 560068<br />
                Email: support@avantra.in<br />
                Phone: +91-9030559163
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
