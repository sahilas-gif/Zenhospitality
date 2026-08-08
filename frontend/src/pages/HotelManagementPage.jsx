import PageHeader from '../components/PageHeader';
import { Building2, TrendingUp, Key, HeadphonesIcon } from 'lucide-react';

const items = [
  { title: 'OTA Optimization', desc: 'Maximizing visibility and conversion on Booking.com, Agoda, MakeMyTrip, and more.' },
  { title: 'Revenue Management', desc: 'Dynamic pricing strategies to ensure maximum RevPAR.' },
  { title: 'Pre-Opening Advisory', desc: 'Strategic planning, staffing, and positioning for new properties.' },
];

const HotelManagementPage = () => (
  <div>
    <PageHeader title="Hotel Management & Operator Services" subtitle="Maximizing revenue and operational efficiency for premium properties." />
    <section className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-4 md:mb-6">Expertise That Drives Results</h2>
            <p className="text-gray-400 text-sm md:text-base">
              With years of industry experience, Zen World Hospitality offers comprehensive operator services designed to elevate property performance. We handle everything from pre-opening advisories to daily OTA optimization.
            </p>

            <div className="space-y-4 md:space-y-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex space-x-3 md:space-x-4 p-4 glass-card rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                      <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-white mb-0.5 md:mb-1">{item.title}</h4>
                    <p className="text-xs md:text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-full min-h-[500px]">
            <div className="absolute inset-0 bg-[url('/hotel-management-bg.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/60 to-[#0a0f1c]/20" />
            
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
              <div className="space-y-3 mb-6">
                <div className="bg-[#0a0f1c]/70 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Property Ops</h4>
                    <p className="text-gray-400 text-xs">Streamlined daily operations</p>
                  </div>
                </div>

                <div className="bg-[#0a0f1c]/70 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Turnkey Solutions</h4>
                    <p className="text-gray-400 text-xs">End-to-end management</p>
                  </div>
                </div>
                
                <div className="bg-[#0a0f1c]/70 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">24/7 Support</h4>
                    <p className="text-gray-400 text-xs">Always-on guest assistance</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 rounded-2xl text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white tracking-wide">Elevate Your Property</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HotelManagementPage;
