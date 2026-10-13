import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ScopeOfServices from '../components/ScopeOfServices';
import usePageContent from '../hooks/usePageContent';

const HomePage = () => {
  const content = usePageContent('home');
  return (
    <>
      <Hero title={content.hero_title} subtitle={content.hero_subtitle} description={content.hero_description} />
      <AboutSection />
      <ScopeOfServices />

      <section className="py-16 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-8 md:p-12 rounded-2xl md:rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-900/20" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold font-playfair mb-4 md:mb-6">{content.cta_title || 'Ready for an Unforgettable Journey?'}</h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8 text-sm md:text-base">
                {content.cta_description || 'Explore our premium customized travel packages or chat with our AI assistant to generate a personalized itinerary instantly.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6">
                <a href="/services/retail" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-8 py-3 rounded-full font-medium text-sm md:text-base">Explore Packages</a>
                <a href="/contact" className="w-full sm:w-auto border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 px-6 md:px-8 py-3 rounded-full font-medium text-sm md:text-base">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
