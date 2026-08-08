import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Compass, Building2, Briefcase, ShoppingBag } from 'lucide-react';
import api from '../lib/api';
import PackageCard from './PackageCard';
import EnquiryModal from './EnquiryModal';
import ScrollReveal from './ScrollReveal';
import useLocalStorage from '../hooks/useLocalStorage';
import { fallbackPackages } from '../data/fallback';

const tabs = [
  { label: 'All', value: 'all', icon: Compass },
  { label: 'Retail', value: 'travel_booking', icon: ShoppingBag },
  { label: 'Corporate', value: 'corporate', icon: Briefcase },
  { label: 'Hotel', value: 'hotel_management', icon: Building2 },
];

const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

const Skeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
    <div className="h-48 md:h-56 bg-gray-800" />
    <div className="p-5 md:p-6 space-y-4">
      <div className="h-5 bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-800 rounded w-1/3" />
      <div className="h-4 bg-gray-800 rounded w-full" />
      <div className="h-4 bg-gray-800 rounded w-1/2" />
      <div className="h-10 bg-gray-800 rounded-xl w-full mt-4" />
    </div>
  </div>
);

const PackagesSection = () => {
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useLocalStorage('zenWishlist', []);

  const normalizePackage = (pkg) => {
    const match = fallbackPackages.find(
      (f) => f.title.toLowerCase() === pkg.title?.toLowerCase() || f.destination?.toLowerCase() === pkg.destination?.toLowerCase()
    );
    return {
      ...pkg,
      image: pkg.image || pkg.image_url || match?.image || null,
      images: pkg.images || (pkg.image ? [pkg.image] : match?.images || []),
      rating: pkg.rating || match?.rating || 0,
      reviewCount: pkg.reviewCount || match?.reviewCount || 0,
      description: pkg.description || match?.description || '',
      destination: pkg.destination || match?.destination || '',
      duration: pkg.duration || (pkg.duration_days ? `${pkg.duration_days} Days` : match?.duration || ''),
      price: pkg.price ?? pkg.price_from ?? match?.price ?? null,
    };
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get('/packages');
        setPackages(data?.length ? data.map(normalizePackage) : fallbackPackages);
      } catch {
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...packages];

    if (activeTab !== 'all') result = result.filter((p) => p.category === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => (a.price || Infinity) - (b.price || Infinity)); break;
      case 'price_desc': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break;
    }
    return result;
  }, [packages, activeTab, searchQuery, sortBy]);

  return (
    <section className="py-16 md:py-24 bg-[#0a0f1c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">Discover</h2>
            <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4 md:mb-6">Our Premium Packages</h3>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">Handpicked experiences designed to create unforgettable memories.</p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4 border-b border-gray-800 pb-4 w-full md:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button 
                  key={tab.value} 
                  onClick={() => setActiveTab(tab.value)} 
                  className={`flex flex-col items-center gap-2 pb-2 px-2 transition-all border-b-2 ${isActive ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-500' : 'text-gray-500'}`} />
                  <span className="text-[11px] font-semibold tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0 lg:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search packages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-500" />
            </div>
            <div className="relative">
              <button onClick={() => setShowFilters((o) => !o)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-600 transition-colors">
                <SlidersHorizontal className="w-4 h-4" /> Sort
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-nav border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-30">
                  {sortOptions.map((opt) => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowFilters(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-800/50 ${sortBy === opt.value ? 'text-emerald-400 bg-gray-800/30' : 'text-gray-300'}`}>
                      <ArrowUpDown className="w-3 h-3 inline mr-2" />{opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} />)}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No packages found</p>
            <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {filteredAndSorted.map((pkg, idx) => (
              <ScrollReveal key={pkg.id} delay={idx * 50}>
                <PackageCard pkg={pkg} onEnquire={(p) => { setSelectedPackage(p); setIsModalOpen(true); }} isWishlisted={wishlist.includes(pkg.id)} onToggleWishlist={toggleWishlist} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {wishlist.length > 0 && !loading && filteredAndSorted.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">{wishlist.length} package{wishlist.length !== 1 && 's'} saved <span role="img" aria-label="heart">❤️</span></p>
          </div>
        )}
      </div>

      {isModalOpen && <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pkg={selectedPackage} />}
    </section>
  );
};

export default PackagesSection;
