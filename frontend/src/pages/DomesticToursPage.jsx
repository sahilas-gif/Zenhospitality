import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Check, Plus, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DestinationCard from '../components/DestinationCard';
import EnquiryModal from '../components/EnquiryModal';
import ScrollReveal from '../components/ScrollReveal';
import {
  domesticTours,
  sacredCircuitItinerary,
  tourFacilities,
  tourAddons,
} from '../data/domesticTours';
import { CONTACT } from '../data/contact';

const statePages = [
  { name: 'Kerala Tours', slug: 'kerala', tagline: 'Backwaters, Hills & Ayurveda', color: 'from-green-600 to-emerald-700' },
  { name: 'Goa Tours', slug: 'goa', tagline: 'Beaches, Churches & Nightlife', color: 'from-amber-500 to-orange-600' },
  { name: 'Gujarat Tours', slug: 'gujarat', tagline: 'Rann of Kutch, Somnath & Gir', color: 'from-yellow-500 to-amber-600' },
  { name: 'Mumbai Tours', slug: 'mumbai', tagline: 'Gateway, Bollywood & Coastal Charm', color: 'from-blue-500 to-indigo-600' },
  { name: 'Uttar Pradesh Tours', slug: 'up', tagline: 'Kashi, Prayag, Ayodhya & Braj', color: 'from-purple-500 to-violet-600' },
  { name: 'Maharashtra Tours', slug: 'maharashtra', tagline: 'Forts, Caves & Konkan Coast', color: 'from-red-500 to-rose-600' },
  { name: 'Chardham Yatra', slug: 'chardham', tagline: 'Yamunotri, Gangotri, Kedarnath & Badrinath', color: 'from-teal-500 to-cyan-600' },
];

const DomesticToursPage = () => {
  const [selected, setSelected] = useState(null);
  const [showAllDays, setShowAllDays] = useState(false);

  const flagship = sacredCircuitItinerary;
  const visibleDays = showAllDays ? flagship.itinerary : flagship.itinerary.slice(0, 4);

  // Tours are custom offerings (not DB packages), so clear the package id before
  // opening the enquiry modal to keep it a general enquiry.
  const openEnquiry = (tour) => setSelected({ id: null, title: tour.title, price: tour.price });

  return (
    <div>
      <PageHeader
        title="Domestic Tours"
        subtitle="Explore India's finest destinations — handcrafted spiritual yatras, beach getaways, heritage circuits & mountain pilgrimages."
      />

      {/* Browse by State */}
      <section className="py-12 md:py-16 bg-[#0c1222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">Browse by Destination</h2>
              <h3 className="text-2xl md:text-4xl font-playfair font-bold text-white">Choose Your State</h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {statePages.map((s, idx) => (
              <ScrollReveal key={s.slug} delay={idx * 60}>
                <Link
                  to={`/domestic-tours/${s.slug}`}
                  className="group block glass-card rounded-xl p-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-1 group-hover:text-emerald-400 transition-colors">{s.name}</h4>
                  <p className="text-gray-400 text-xs">{s.tagline}</p>
                  <div className="mt-3 flex items-center text-emerald-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Signature Tour */}
      <section className="py-16 md:py-20 bg-[#0f2e24] relative overflow-hidden border-t border-[#c9a86a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-[#e8d5a8] font-medium tracking-widest uppercase text-sm mb-2">Signature Tour</p>
              <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">{flagship.title}</h2>
              <p className="text-[#e8d5a8] text-lg italic mb-3">{flagship.duration}</p>
              <p className="text-gray-200/90 leading-relaxed mb-6 max-w-xl">{flagship.description}</p>

              <ul className="space-y-2.5 mb-6">
                {flagship.highlights.map((h, i) => (
                  <li key={i} className="flex items-start text-gray-100 text-sm">
                    <Check className="w-4 h-4 text-[#e8d5a8] mr-2 mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${CONTACT.phonePrimaryWhatsApp}?text=${encodeURIComponent('Hi Zen World Hospitality, I would like to know more about the ' + flagship.duration + ' tour.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold transition-all hover-glow"
              >
                <Phone className="w-4 h-4 mr-2" /> Plan this Yatra — {CONTACT.phonePrimary}
              </a>
            </div>

            <div>
              <h3 className="text-[#e8d5a8] font-bold uppercase tracking-wider text-sm mb-5 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Day-by-Day Itinerary
              </h3>
              <div className="space-y-3">
                {visibleDays.map((d) => (
                  <div key={d.day} className="glass-card rounded-xl p-4 border border-white/5 bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {d.day}
                      </span>
                      <div>
                        <p className="text-white font-semibold text-sm">{d.title}</p>
                        <p className="text-gray-300 text-xs leading-snug mt-0.5">{d.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAllDays((o) => !o)}
                className="mt-4 inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-semibold"
              >
                <Plus className="w-4 h-4 mr-1" /> {showAllDays ? 'Show fewer days' : `Show full ${flagship.itinerary.length}-day journey`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Tour Circuits */}
      <section className="py-16 md:py-24 bg-[#0a0f1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">Explore Circuits</h2>
              <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4 md:mb-6">Choose Your Pilgrimage</h3>
              <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
                Every circuit is tailor-made — flexible timings for elders, satvik food, and VIP darshan throughout.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
            {domesticTours.map((tour, idx) => (
              <ScrollReveal key={tour.id} delay={idx * 50}>
                <DestinationCard tour={tour} onEnquire={openEnquiry} />
              </ScrollReveal>
            ))}
            {/* Contact CTA card to fill the grid */}
            <ScrollReveal delay={domesticTours.length * 50}>
              <div className="glass-card flex flex-col items-center justify-center p-8 rounded-2xl text-center h-full border border-dashed border-emerald-500/30">
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">Don't see your route?</p>
                <h4 className="text-white font-playfair font-bold text-xl mb-3">We Can Build It</h4>
                <p className="text-gray-400 text-sm mb-5">
                  Add-ons — {tourAddons.join(', ')}. Custom pick-up from VNS / PRYJ / LKO / DEL. Corporate & large jatha groups welcome.
                </p>
                <a href={CONTACT.emailPrimaryMailto} className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm">
                  {CONTACT.emailPrimary}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-[#0f2e24] border-t border-[#c9a86a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-[#e8d5a8] font-bold uppercase tracking-widest text-sm mb-8">Included on Every Yatra</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourFacilities.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 bg-white/[0.03]">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#e8d5a8] mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200 text-sm leading-relaxed">{f}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected && <EnquiryModal isOpen={!!selected} onClose={() => setSelected(null)} pkg={selected} />}
    </div>
  );
};

export default DomesticToursPage;