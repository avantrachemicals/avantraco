import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div data-testid="terms-page" className="bg-gray-50 min-h-screen">
      <section className="py-16 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-8 md:p-12 prose prose-gray max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using the Avantra Chemicals website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>

              <h2>2. Products and Services</h2>
              <p>Avantra Chemicals Pvt Ltd manufactures and distributes agricultural inputs including biostimulants, biofertilizers, liquid fertilizers, micronutrients, and water-soluble fertilizers. All products are manufactured as per applicable Indian regulations and standards.</p>
              
              <h2>3. Product Usage</h2>
              <p>Our products are intended for agricultural use only. Users must follow the recommended dosage and application methods as specified on product labels. Avantra Chemicals is not liable for any damages arising from misuse or improper application of products.</p>

              <h2>4. Intellectual Property</h2>
              <p>Phytocode™ technology and all associated trademarks, logos, and brand elements are the exclusive property of Avantra Chemicals Pvt Ltd. Unauthorized use is strictly prohibited.</p>

              <h2>5. Dealer Agreements</h2>
              <p>Dealership applications are subject to approval and verification. Approved dealers must comply with the dealership agreement terms, including pricing guidelines, territory restrictions, and quality maintenance standards.</p>

              <h2>6. Privacy</h2>
              <p>Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.</p>

              <h2>7. Limitation of Liability</h2>
              <p>Avantra Chemicals shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our products or services.</p>

              <h2>8. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.</p>

              <h2>9. Contact Information</h2>
              <p>For any questions regarding these terms, please contact us at:</p>
              <p>
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
