import ContactSection from '../components/ContactSection';
import PageHeader from '../components/PageHeader';
import usePageContent from '../hooks/usePageContent';

const ContactPage = () => {
  const content = usePageContent('contact');
  return (
    <div>
      <PageHeader title={content.header_title || 'Contact Us'} subtitle={content.header_subtitle || 'We would love to hear from you.'} />
      <div className="py-12">
        <ContactSection />
      </div>
    </div>
  );
};

export default ContactPage;
