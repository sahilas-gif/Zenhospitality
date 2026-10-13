import { Link } from 'react-router-dom';
import { Globe, ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const InternationalToursPage = () => (
  <div className="pt-24 min-h-screen">
    <PageHeader title="International Tours" subtitle="Explore the World" />
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-8" />
      <p className="inline-block px-4 py-1.5 rounded-full border border-gold-500/20 text-gold-400 text-sm mb-6 uppercase tracking-widest">Coming Soon</p>
      <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Global Destinations</h2>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">We are preparing an exclusive collection of international tour packages. Soon you will be able to book incredible journeys to breathtaking destinations around the world.</p>
      <Link to="/" className="inline-flex items-center text-emerald-400"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
    </div>
  </div>
);

export default InternationalToursPage;
