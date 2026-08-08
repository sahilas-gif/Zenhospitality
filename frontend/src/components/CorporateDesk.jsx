import { Briefcase, Building, Plane, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Plane, title: 'MICE Solutions', desc: 'Meetings, Incentives, Conferences, and Exhibitions planned to perfection.' },
  { icon: Building, title: 'Offsite & Team Building', desc: 'Curated corporate retreats designed to boost team morale and productivity.' },
  { icon: Briefcase, title: 'Business Travel', desc: 'Seamless flight, hotel, and visa arrangements for corporate executives.' },
  { icon: CalendarCheck, title: 'Event Management', desc: 'End-to-end management for product launches and corporate galas.' },
];

const CorporateDesk = () => (
  <section className="py-16 md:py-24 bg-[#111827] relative">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
        <div className="w-full lg:w-1/2">
          <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">Corporate Desk</h2>
          <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-5 md:mb-6">Elevating Corporate Experiences</h3>
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
            At Zen World Hospitality, we understand that corporate travel and events require precision, professionalism, and a touch of luxury. Our Corporate Desk is dedicated to streamlining your business needs with bespoke solutions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mr-3 md:mr-4 flex-shrink-0">
                  <f.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm md:text-base mb-0.5">{f.title}</h4>
                  <p className="text-gray-500 text-xs md:text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10">
            <Link to="/contact" className="inline-block px-6 md:px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-colors text-sm md:text-base">
              Partner With Us
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group">
            <div className="absolute inset-0 bg-emerald-500/20 group-hover:bg-transparent transition-all duration-500 z-10" />
            <img src="/images/corporate_event_premium.jpg" alt="A professional corporate meeting room setup representing premium business event solutions" className="w-full object-cover aspect-[4/3] transform group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 z-20 glass-card p-4 md:p-6 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white font-playfair mb-1">500+</p>
                  <p className="text-emerald-400 text-xs md:text-sm font-medium">Corporate Events</p>
                </div>
                <div className="w-px h-10 md:h-12 bg-gray-600" />
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white font-playfair mb-1">50k+</p>
                  <p className="text-emerald-400 text-xs md:text-sm font-medium">Executives Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CorporateDesk;
