import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import HotelCard from '../components/hotels/HotelCard';
import FilterPills from '../components/ui/FilterPills';
import Reveal from '../components/motion/Reveal';
import TextReveal from '../components/motion/TextReveal';
import { useHotels } from '../hooks/useHotels';
import { useSeo } from '../lib/seo';
import { whatsappUrl } from '../lib/whatsapp';

export default function HotelsPage() {
  useSeo('Partner Hotels', 'Handpicked partner hotels in Lonavala, Mumbai and beyond, with best rates via Zen World Hospitality.');
  const { items, cities, loading, error } = useHotels({ limit: 100 });
  const [city, setCity] = useState('All');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (h) =>
        (city === 'All' || h.city === city) &&
        (!term || [h.name, h.city, h.locality, h.summary].filter(Boolean).some((v) => v.toLowerCase().includes(term))),
    );
  }, [items, city, q]);

  return (
    <div className="relative">
      <section className="relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-44">
        <div className="glow-gold pointer-events-none absolute -top-20 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <p className="eyebrow mb-5">Partner hotels</p>
          <TextReveal as="h1" className="max-w-4xl text-5xl leading-[1] text-pearl md:text-7xl">
            Stays we know, at rates we negotiate.
          </TextReveal>
          <p className="mt-6 max-w-xl text-pearl/65 md:text-lg">
            Every hotel here is booked through Zen. Send one enquiry and a planner confirms the room, the rate and the details for you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <FilterPills label="Filter by city" options={['All', ...cities]} value={city} onChange={setCity} />
          <label className="relative block md:w-72">
            <span className="sr-only">Search hotels</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pearl/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or area"
              className="hairline w-full rounded-full bg-ink-900/60 py-2.5 pl-11 pr-4 text-sm text-pearl placeholder:text-pearl/35 focus:border-gold/50 focus:outline-none"
            />
          </label>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-ink-800/60" />)}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-gold/15 p-10 text-center">
            <p className="text-pearl/75">{error}</p>
            <a href={whatsappUrl('Hi Zen, please share your partner hotels.')} target="_blank" rel="noreferrer" className="mt-4 inline-block text-gold">Ask us on WhatsApp</a>
          </div>
        ) : shown.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((h, i) => (
              <Reveal key={h.slug} delay={(i % 3) * 0.06}>
                <HotelCard hotel={h} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gold/15 p-10 text-center text-pearl/70">
            No hotels match that search. <button type="button" className="text-gold" onClick={() => { setQ(''); setCity('All'); }}>Clear filters</button>
          </div>
        )}

        <div className="mt-16 rounded-3xl border border-gold/15 p-8 text-center md:p-12">
          <p className="font-display text-3xl text-pearl md:text-4xl">Need a city we don't list yet?</p>
          <p className="mt-3 text-pearl/60">We book hotels across India. Tell us where and we'll find the right stay.</p>
          <Link to="/contact" className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink-950">Ask for a hotel</Link>
        </div>
      </section>
    </div>
  );
}
