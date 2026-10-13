import PageHeader from '../components/PageHeader';
import { Users, Calendar, Award, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

const items = [
  { icon: Users, title: 'Meetings', desc: 'A room, a projector and rooms for the night, for a board meeting or an offsite.' },
  { icon: Award, title: 'Incentives', desc: 'A trip for the people you want to thank, with the dates locked in.' },
  { icon: Mic, title: 'Conferences', desc: 'Hall, stay and airport transfers for a larger industry event.' },
  { icon: Calendar, title: 'Exhibitions', desc: 'Rooms and local transport for a team attending a show.' },
];

const MicePage = () => {
  useSeo('MICE and events, Mumbai', 'Meetings, incentives, conferences and exhibitions in Mumbai, with rooms in Andheri or Lonavala and cars for the group.');
  return (
  <div>
    <PageHeader title="MICE & Event Accommodations" subtitle="Meetings, Incentives, Conferences, and Exhibitions Management." />
    <section className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold font-playfair mb-5 md:mb-6">Meetings and events</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            A board meeting for eight or a conference for a few hundred. Tell us the city and the dates. We book the stay, the hall and the cars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, idx) => (
            <Link to="/contact" key={idx} className="block glass-card p-6 md:p-8 rounded-2xl hover-glow group transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-900/50 flex items-center justify-center mb-5 md:mb-6 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
              <div className="mt-4 md:mt-6 flex items-center text-emerald-400 text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Enquire Now <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </div>
  );
};

export default MicePage;
