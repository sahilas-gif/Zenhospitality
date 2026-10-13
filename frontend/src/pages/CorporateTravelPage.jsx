import PageHeader from '../components/PageHeader';
import CorporateDesk from '../components/CorporateDesk';
import { useSeo } from '../lib/seo';

const CorporateTravelPage = () => {
  useSeo('Corporate travel, Mumbai', 'Flights, hotels and cars for company travel from Mumbai, including offsites in Lonavala and stays in Andheri.');
  return (
  <div>
    <PageHeader title="Corporate travel" subtitle="Flights, hotels and cars for people travelling on company work." />
    <div className="py-8 md:py-12"><CorporateDesk /></div>
  </div>
  );
};

export default CorporateTravelPage;
