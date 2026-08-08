import PageHeader from '../components/PageHeader';
import AiItineraryGenerator from '../components/AiItineraryGenerator';
import PackagesSection from '../components/PackagesSection';

const RetailPage = () => (
  <div>
    <PageHeader title="Retail & B2C Booking" subtitle="Premium customized travel packages across top destinations." />
    <AiItineraryGenerator />
    <PackagesSection />
  </div>
);

export default RetailPage;
