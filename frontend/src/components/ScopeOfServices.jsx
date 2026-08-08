import { Map, Hotel, TrendingUp } from 'lucide-react';

const services = [
  {
    icon: Map, title: 'Travel & Tourism', color: 'emerald',
    items: ['Customized Leisure & Holiday Packages', 'Domestic & International Tours', 'Luxury Honeymoon & Cruise Packages', 'Adventure & Spiritual Tourism'],
    accent: '#10b981',
  },
  {
    icon: TrendingUp, title: 'Hotel Management', color: 'gold',
    items: ['Strategic Sales & Marketing', 'Revenue Management & Yield Optimization', 'Pre-Opening Support for New Hotels', 'Brand Positioning & Online Reputation'],
    accent: '#d4a854',
  },
  {
    icon: Hotel, title: 'Hospitality Solutions', color: 'blue',
    items: ['B2B Agent Networking & Contracting', 'Franchise & Hotel Tie-ups', 'Staff Training & Standard Operating Procedures', 'Technology Integration (PMS/Channel Managers)'],
    accent: '#60a5fa',
  },
];

const ScopeOfServices = () => (
  <section className="py-16 md:py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">Our Expertise</h2>
        <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">Scope of Services</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-[#d4a854] mx-auto rounded-full mb-6" />
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Comprehensive solutions tailored for every aspect of the hospitality and travel industry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {services.map((s, idx) => (
          <div key={idx} className="glass-card flex flex-col rounded-2xl overflow-hidden group hover:border-gray-600 transition-colors h-full">
            <div className="p-6 md:p-8 flex-grow">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 bg-gray-800 group-hover:scale-110 transition-transform duration-300"
                style={{ color: s.accent, boxShadow: `0 0 20px ${s.accent}33` }}
              >
                <s.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h4 className="text-xl md:text-2xl font-playfair font-bold text-white mb-5 md:mb-6">{s.title}</h4>
              <ul className="space-y-3 md:space-y-4">
                {s.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: s.accent }} />
                    <span className="text-gray-400 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${s.accent}cc, ${s.accent}66)` }} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ScopeOfServices;
