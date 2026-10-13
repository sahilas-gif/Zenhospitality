import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BedDouble, Check, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import Gallery from '../components/hotels/Gallery';
import { RateBadge } from '../components/hotels/HotelCard';
import QuoteDrawer from '../components/QuoteDrawer';
import Carousel from '../components/ui/Carousel';
import Reveal from '../components/motion/Reveal';
import TextReveal from '../components/motion/TextReveal';
import MagneticButton from '../components/motion/MagneticButton';
import NotFoundPage from './NotFoundPage';
import { useHotel } from '../hooks/useHotels';
import { CONTACT } from '../data/contact';
import { useSeo } from '../lib/seo';
import { whatsappUrl } from '../lib/whatsapp';

function Chips({ title, items }) {
  if (!items?.length) return null;
  return (
    <Reveal className="border-t border-gold/10 py-10">
      <h2 className="mb-6 font-display text-3xl text-pearl">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((a) => (
          <li key={a} className="flex items-start gap-3 text-pearl/75">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {a}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function HotelDetailPage() {
  const { slug } = useParams();
  const { hotel, loading, notFound, error } = useHotel(slug);
  const [quote, setQuote] = useState(null);
  useSeo(hotel ? `${hotel.name}, ${hotel.city}` : null, hotel?.summary);

  if (notFound) return <NotFoundPage />;
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 md:px-8">
        <div className="h-12 w-2/3 animate-pulse rounded-full bg-ink-800/60" />
        <div className="mt-10 aspect-[16/9] animate-pulse rounded-[2rem] bg-ink-800/60" />
      </div>
    );
  }
  if (error || !hotel) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center">
        <p className="text-pearl/75">{error}</p>
        <a href={whatsappUrl(`Hi Zen, I'd like to know about ${slug}.`)} target="_blank" rel="noreferrer" className="mt-4 inline-block text-gold">Ask us on WhatsApp</a>
      </div>
    );
  }

  const location = [hotel.locality, hotel.city, hotel.state].filter(Boolean).join(', ');
  const openQuote = (room = '') => setQuote({ room });
  const paragraphs = (hotel.description || '').split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="pb-28">
      <section className="mx-auto max-w-7xl px-5 pt-32 md:px-8 md:pt-40">
        <Link to="/hotels" className="mb-8 inline-flex items-center gap-2 text-sm text-pearl/60 hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> All hotels
        </Link>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2">
              {hotel.category || 'Partner hotel'}
              {hotel.star_rating ? <span className="flex items-center gap-1">· {hotel.star_rating}<Star className="h-3 w-3 fill-gold" /></span> : null}
            </p>
            <TextReveal as="h1" className="text-5xl leading-[1] text-pearl md:text-7xl">{hotel.name}</TextReveal>
            <p className="mt-4 flex items-center gap-2 text-pearl/65"><MapPin className="h-4 w-4 text-gold" /> {location}</p>
          </div>
          <RateBadge hotel={hotel} className="self-start border border-gold/25 px-4 py-2 text-sm md:self-auto" />
        </div>
        <Gallery images={hotel.images} name={hotel.name} />
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_22rem]">
        <div>
          {hotel.summary && <p className="font-display text-3xl leading-snug text-pearl/90 md:text-4xl">{hotel.summary}</p>}
          <div className="mt-8 space-y-5 text-pearl/70 md:text-lg">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {hotel.highlights?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {hotel.highlights.map((h) => <span key={h} className="hairline rounded-full px-4 py-2 text-sm text-pearl/80">{h}</span>)}
            </div>
          )}

          {hotel.room_types?.length > 0 && (
            <div className="mt-16 border-t border-gold/10 pt-10">
              <h2 className="mb-6 font-display text-3xl text-pearl">Rooms</h2>
              <Carousel label="Room types" itemClassName="w-[80%] sm:w-[48%]">
                {hotel.room_types.map((r) => (
                  <div key={r.name} className="flex h-full flex-col rounded-[1.5rem] border border-gold/15 bg-ink-900/50 p-6">
                    <BedDouble className="h-6 w-6 text-gold" />
                    <h3 className="mt-4 font-display text-2xl text-pearl">{r.name}</h3>
                    {r.occupancy && <p className="mt-1 text-xs uppercase tracking-wider text-pearl/45">{r.occupancy}</p>}
                    {r.description && <p className="mt-3 flex-1 text-sm text-pearl/65">{r.description}</p>}
                    {r.features?.length > 0 && <p className="mt-3 text-xs text-pearl/50">{r.features.join(' · ')}</p>}
                    <button type="button" onClick={() => openQuote(r.name)} className="mt-6 self-start rounded-full border border-gold/30 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-ink-950">
                      Get best rate
                    </button>
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          <div className="mt-6">
            <Chips title="Amenities" items={hotel.amenities} />
            <Chips title="Nearby" items={hotel.nearby} />
            <Chips title="Good to know" items={[
              ...(hotel.check_in_time ? [`Check-in from ${hotel.check_in_time}`] : []),
              ...(hotel.check_out_time ? [`Check-out by ${hotel.check_out_time}`] : []),
              ...(hotel.policies || []),
            ]} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[1.75rem] border border-gold/20 bg-ink-900/60 p-6 backdrop-blur">
            <p className="eyebrow">Best rates via Zen</p>
            <p className="mt-3 font-display text-3xl text-pearl">
              {Number(hotel.price_from) > 0 ? <>From ₹{Number(hotel.price_from).toLocaleString('en-IN')}</> : 'Get best rate'}
            </p>
            <p className="mt-2 text-sm text-pearl/60">{hotel.rate_note || 'Share your dates and a planner confirms availability and the rate.'}</p>
            <MagneticButton onClick={() => openQuote()} className="mt-6 w-full" strength={0.15}>
              Request a quote
            </MagneticButton>
            <a href={whatsappUrl(`Hi Zen World Hospitality, I'd like the best rate at ${hotel.name}, ${hotel.city}.`)} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full border border-gold/20 py-3 text-sm text-pearl/85 hover:text-pearl">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={CONTACT.phonePrimaryTel} className="mt-3 flex items-center justify-center gap-2 text-sm text-pearl/60 hover:text-gold">
              <Phone className="h-4 w-4" /> {CONTACT.phonePrimary}
            </a>
          </div>
        </aside>
      </section>

      <div className="fixed bottom-4 left-4 right-[5.25rem] z-40 lg:hidden">
        <button type="button" onClick={() => openQuote()} className="w-full rounded-full bg-gold py-4 font-semibold text-ink-950 shadow-[0_10px_40px_-10px_rgba(212,175,55,0.8)]">
          Get best rate
        </button>
      </div>

      <QuoteDrawer
        open={quote !== null}
        onClose={() => setQuote(null)}
        context={{ type: 'hotel', hotel, title: hotel.name, subtitle: location, room: quote?.room, stay: true }}
      />
    </div>
  );
}
