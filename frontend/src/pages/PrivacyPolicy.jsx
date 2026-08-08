import PageHeader from '../components/PageHeader';

const PrivacyPolicy = () => (
  <div>
    <PageHeader title="Privacy Policy" subtitle="Your privacy is critically important to us." />
    
    <div className="py-16 bg-[#0a0f1c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300 space-y-8">
        <section>
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">1. Information We Collect</h2>
          <p className="leading-relaxed">
            At Zen World Hospitality, we collect information that you provide directly to us when you book a package, make an enquiry, or communicate with us. This may include your name, email address, phone number, and travel preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, process transactions, send you related information, and respond to your comments, questions, and requests. We may also use your information to communicate with you about products, services, offers, and events offered by Zen World Hospitality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">3. Data Security</h2>
          <p className="leading-relaxed">
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, please note that no electronic transmission of information can be entirely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">4. Sharing of Information</h2>
          <p className="leading-relaxed">
            We may share personal information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at sales@zenhospitality.in or connect.zenworld@gmail.com, or call us at +91 80978 62804 / +91 80973 77058.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
