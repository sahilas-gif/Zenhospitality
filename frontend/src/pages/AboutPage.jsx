import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';

const AboutPage = () => (
  <div>
    <PageHeader title="About Zen World" subtitle="Simplifying Corporate Stays across India since 2018." />
    <div className="py-8 md:py-12"><AboutSection /></div>
  </div>
);

export default AboutPage;
