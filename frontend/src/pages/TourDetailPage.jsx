import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MapPin, Check, Plus, ArrowLeft, Clock, Star } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EnquiryModal from '../components/EnquiryModal';
import ScrollReveal from '../components/ScrollReveal';
import { CONTACT } from '../data/contact';

// Import all tour data
import {
  keralaTours,
  goaTours,
  gujaratTours,
  mumbaiTours,
  upTours,
  maharashtraTours,
  chardhamTours,
} from '../data/tourPages/index';

const tourDataMap = {
  kerala: { tours: keralaTours, title: 'Kerala Tours', subtitle: 'God\'s Own Country — Backwaters, Hills, Beaches & Ayurveda' },
  goa: { tours: goaTours, title: 'Goa Tours', subtitle: 'Sun, Sand & Heritage — Beaches, Churches & Nightlife' },
  gujarat: { tours: gujaratTours, title: 'Gujarat Tours', subtitle: 'Vibrant Culture — Rann of Kutch, Somnath, Gir & Dwarka' },
  mumbai: { tours: mumbaiTours, title: 'Mumbai Tours', subtitle: 'City of Dreams — Gateway, Bollywood & Coastal Charm' },
  up: { tours: upTours, title: 'Uttar Pradesh Tours', subtitle: 'Spiritual Heritage — Kashi, Prayag, Ayodhya & Braj' },
  maharashtra: { tours: maharashtraTours, title: 'Maharashtra Tours', subtitle: 'Forts, Caves & Coastline — Pune, Nashik, Aurangabad & Konkan' },
  chardham: { tours: chardhamTours, title: 'Chardham Yatra', subtitle: 'Sacred Pilgrimage — Yamunotri, Gangotri, Kedarnath & Badrinath' },
};

const P = (seed, w = 800, h = 500) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const TourDetailPage = () => {
  const { state } = useParams();
  const [selected, setSelected] = useState(null);
  const [expandedTour, setExpandedTour] = useState(null);

  const data = tourDataMap[state];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-white mb-4">Tour Not Found</h2>
          <p className="text-gray-400 mb-6">The tour page you're looking for doesn't exist.</p>
          <Link to="/domestic-tours" className="text-emerald-400 hover:text-emerald-300 font-semibold">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to All Tours
          </Link>
        </div>
      </div>
    );
  }

  const { tours, title, subtitle } = data;
  const openEnquiry = (tour) => setSelected({ id: null, title: tour.title, price: tour.price });

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      {/* Back link */}
      <div className="bg-[#0a0f1c] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/domestic-tours" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Domestic Tours
          </Link>
        </div>
      </div>

      {/* Tour Cards */}
      <section className="py-12 md:py-20 bg-[#0a0f1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {tours.map((tour, idx) => {
              const isExpanded = expandedTour === tour.id;
              const visibleItinerary = isExpanded
                ? tour.itinerary
                : (tour.itinerary || []).slice(0, 4);

              return (
                <ScrollReveal key={tour.id} delay={idx * 80}>
                  <div className="glass-card rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Image & Info */}
                      <div className="relative">
                        <img
                          src={tour.image || P(tour.slug || tour.id)}
                          alt={tour.title}
                          className="w-full h-64 lg:h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent lg:bg-gradient-to-r" />
                        <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6">
                          {tour.rating && (
                            <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-amber-400 mb-2">
                              <Star className="w-3 h-3 fill-current" /> {tour.rating}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8">
                        <p className="text-[#e8d5a8] font-medium tracking-widest uppercase text-xs mb-2">
                          {tour.destination || tour.state}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2">
                          {tour.title}
                        </h3>
                        {tour.duration && (
                          <p className="text-emerald-400 text-sm flex items-center gap-1 mb-3">
                            <Clock className="w-3.5 h-3.5" /> {tour.duration}
                          </p>
                        )}
                        {tour.route && (
                          <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                            <MapPin className="w-3.5 h-3.5" /> {tour.route}
                          </p>
                        )}
                        <p className="text-gray-200/90 leading-relaxed text-sm mb-5">
                          {tour.description}
                        </p>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                          <div className="mb-5">
                            <h4 className="text-[#e8d5a8] font-bold uppercase tracking-wider text-xs mb-3">Highlights</h4>
                            <ul className="space-y-1.5">
                              {tour.highlights.map((h, i) => (
                                <li key={i} className="flex items-start text-gray-100 text-xs">
                                  <Check className="w-3.5 h-3.5 text-[#e8d5a8] mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                          <div className="mb-5">
                            <h4 className="text-[#e8d5a8] font-bold uppercase tracking-wider text-xs mb-3 flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1.5" /> Day-by-Day Itinerary
                            </h4>
                            <div className="space-y-2">
                              {visibleItinerary.map((d) => (
                                <div key={d.day} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                  <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {d.day}
                                  </span>
                                  <div>
                                    <p className="text-white font-semibold text-xs">{d.title}</p>
                                    <p className="text-gray-300 text-xs leading-snug mt-0.5">{d.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {tour.itinerary.length > 4 && (
                              <button
                                onClick={() => setExpandedTour(isExpanded ? null : tour.id)}
                                className="mt-3 inline-flex items-center text-emerald-400 hover:text-emerald-300 text-xs font-semibold"
                              >
                                <Plus className={`w-3.5 h-3.5 mr-1 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
                                {isExpanded ? 'Show less' : `Show full ${tour.itinerary.length}-day journey`}
                              </button>
                            )}
                          </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={`https://wa.me/${CONTACT.phonePrimaryWhatsApp}?text=${encodeURIComponent('Hi Zen World Hospitality, I would like to know more about the ' + tour.title + '.')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover-glow"
                          >
                            <Phone className="w-4 h-4 mr-2" /> Enquire Now
                          </a>
                          <button
                            onClick={() => openEnquiry(tour)}
                            className="inline-flex items-center bg-transparent border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-5 py-2.5 rounded-full font-bold text-sm transition-all"
                          >
                            Request Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-[#0f2e24] border-t border-[#c9a86a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-[#e8d5a8] font-bold uppercase tracking-widest text-sm mb-3">Can't find your ideal tour?</h3>
          <p className="text-gray-300 text-sm max-w-xl mx-auto mb-6">
            We specialize in custom itineraries. Tell us your dates, group size, and preferences — we'll craft the perfect journey for you.
          </p>
          <a
            href={`https://wa.me/${CONTACT.phonePrimaryWhatsApp}?text=${encodeURIComponent('Hi, I need a custom tour package for ' + title + '.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold transition-all hover-glow"
          >
            <Phone className="w-4 h-4 mr-2" /> Plan Custom Tour — {CONTACT.phonePrimary}
          </a>
        </div>
      </section>

      {selected && <EnquiryModal isOpen={!!selected} onClose={() => setSelected(null)} pkg={selected} />}
    </div>
  );
};

export default TourDetailPage;
