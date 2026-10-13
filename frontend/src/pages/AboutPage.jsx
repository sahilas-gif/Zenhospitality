import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';
import usePageContent from '../hooks/usePageContent';

const AboutPage = () => {
  const content = usePageContent('about');
  return (
    <div>
      <PageHeader title={content.header_title || 'About Zen World'} subtitle={content.header_subtitle || 'Simplifying Corporate Stays across India since 2018.'} />
      <div className="py-8 md:py-12"><AboutSection /></div>
    </div>
  );
};

export default AboutPage;
