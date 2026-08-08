import { Target, Compass, Star } from 'lucide-react';

const AboutSection = () => (
  <section className="py-16 md:py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">About Us</h2>
        <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">Redefining Hospitality</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-[#d4a854] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: Target, color: 'emerald', title: 'Our Vision', desc: 'To be the globally preferred partner in hospitality management, corporate travel, and bespoke leisure experiences, known for innovation, luxury, and unmatched service quality.' },
          { icon: Compass, color: 'gold', title: 'Our Mission', desc: 'We strive to empower hotels to maximize revenue while offering travelers and businesses seamless, premium, and unforgettable journeys across the globe.' },
          { icon: Star, color: 'blue', title: 'Our Core Values', desc: null, list: ['Excellence in Service', 'Integrity & Trust', 'Innovation in Hospitality', 'Customer-Centric Approach'] },
        ].map((item, idx) => (
          <div key={idx} className={`glass-card p-6 md:p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 ${item.color === 'gold' ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : ''}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${item.color === 'emerald' ? 'bg-emerald-500/20' : item.color === 'gold' ? 'bg-[#d4a854]/20' : 'bg-blue-500/20'}`}>
              <item.icon className={`w-8 h-8 ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'gold' ? 'text-[#d4a854]' : 'text-blue-400'}`} />
            </div>
            <h4 className="text-xl md:text-2xl font-playfair font-semibold text-white mb-4">{item.title}</h4>
            {item.desc ? (
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{item.desc}</p>
            ) : (
              <ul className="space-y-3 text-gray-400 text-sm md:text-base">
                {item.list.map((v, i) => (
                  <li key={i} className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0" />{v}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
