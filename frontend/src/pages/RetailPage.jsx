import PageHeader from '../components/PageHeader';
import AiItineraryGenerator from '../components/AiItineraryGenerator';
import PackagesSection from '../components/PackagesSection';

const RetailPage = () => (
  <div>
    <PageHeader title="Retail & B2C Booking" subtitle="Premium customized travel packages across top destinations." />
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <p className="eyebrow mb-3">AI trip planner</p>
      <h2 className="mb-8 font-display text-4xl text-pearl md:text-5xl">Draft your holiday in a minute</h2>
      <AiItineraryGenerator />
    </div>
    <PackagesSection />
  </div>
);

export default RetailPage;
