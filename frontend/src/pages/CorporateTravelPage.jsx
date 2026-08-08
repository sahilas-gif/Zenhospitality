import PageHeader from '../components/PageHeader';
import CorporateDesk from '../components/CorporateDesk';

const CorporateTravelPage = () => (
  <div>
    <PageHeader title="Corporate Travel Management" subtitle="End-to-end booking for flights, hotels, and transit for businesses." />
    <div className="py-8 md:py-12"><CorporateDesk /></div>
  </div>
);

export default CorporateTravelPage;
