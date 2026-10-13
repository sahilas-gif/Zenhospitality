import ContactSection from '../components/ContactSection';
import PageHeader from '../components/PageHeader';
import usePageContent from '../hooks/usePageContent';
import { useSeo } from '../lib/seo';

const ContactPage = () => {
  const content = usePageContent('contact');
  useSeo('Contact Us', 'Reach Zen World Hospitality in Mumbai on WhatsApp (+91 88280 15060), phone, or email for hotel stays, tours, corporate travel, and transport.');
  return (
    <div>
      <PageHeader title={content.header_title || 'Contact'} subtitle={content.header_subtitle || 'WhatsApp, phone or email. Include your dates.'} />
      <ContactSection showForm />
    </div>
  );
};

export default ContactPage;
