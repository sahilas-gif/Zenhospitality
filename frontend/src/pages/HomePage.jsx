import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Briefcase, Bus, Compass, MessageCircle, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import HotelCard from '../components/hotels/HotelCard';
import Carousel from '../components/ui/Carousel';
import SectionHeading from '../components/ui/SectionHeading';
import ParallaxImage from '../components/motion/ParallaxImage';
import Reveal from '../components/motion/Reveal';
import MagneticButton from '../components/motion/MagneticButton';
import usePageContent from '../hooks/usePageContent';
import { useHotels } from '../hooks/useHotels';
import { useSeo } from '../lib/seo';
import { whatsappUrl } from '../lib/whatsapp';

function Tile({ to, eyebrow, title, text, image, icon: Icon, className = '', tall = false }) {
  return (
    <Link to={to} className={`group relative block overflow-hidden rounded-[1.75rem] border border-gold/10 bg-ink-900 ${className}`}>
      {image && (
        <ParallaxImage src={image} alt="" amount={tall ? 50 : 30} className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
      )}
      <div className={`absolute inset-0 ${image ? 'bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/10' : ''}`} />
      {!image && <div className="glow-gold absolute -right-20 -top-20 h-72 w-72 opacity-80" />}
      <div className="relative flex h-full min-h-[15rem] flex-col justify-between p-6 md:p-7">
        <div className="flex items-start justify-between">
          {Icon ? (
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 text-gold"><Icon className="h-5 w-5" /></span>
          ) : <span />}
          <ArrowUpRight className="h-5 w-5 text-pearl/50 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
        </div>
        <div>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h3 className="font-display text-3xl leading-tight text-pearl md:text-4xl">{title}</h3>
          {text && <p className="mt-2 max-w-sm text-sm text-pearl/60">{text}</p>}
        </div>
      </div>
    </Link>
  );
}

const STATS = [
  ['Hotels', 'Partner rates in Lonavala, Mumbai and growing'],
  ['Tours', 'Pilgrimage, beach and heritage circuits across India'],
  ['Fleet', 'Sedans to 45-seat coaches for any group size'],
  ['Corporate', 'Travel desks, offsites and MICE end to end'],
];

const HomePage = () => {
  const content = usePageContent('home');
  const { items: hotels, loading } = useHotels({ featured: true, limit: 8 });
  useSeo(null, 'Partner hotels with best rates via Zen, domestic and international tours, corporate travel, MICE and outstation cabs from Mumbai.');

  return (
    <>
      <Hero
        title={content.hero_title}
        subtitle={content.hero_subtitle}
        description={content.hero_description}
        videoUrl={content.hero_video_url}
      />

      <section className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="What we handle" title="One team for every part of the trip.">
          Book a stay, a pilgrimage, a cab for forty or a three-day offsite. You talk to one planner the whole way.
        </SectionHeading>
        <div className="grid auto-rows-[minmax(15rem,auto)] gap-4 md:grid-cols-6 md:gap-5">
          <Reveal className="md:col-span-4 md:row-span-2">
            <Tile to="/hotels" tall eyebrow="Partner hotels" title="Stays with best rates via Zen" text="Handpicked hotels, one enquiry, a planner who confirms everything for you." image="/images/hotels/the-purple-mango/super-deluxe-ac-room-6.webp" className="h-full min-h-[28rem]" />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-2">
            <Tile to="/plan-trip" eyebrow="AI planner" title="Plan a trip in a minute" icon={Sparkles} className="h-full" />
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-2">
            <Tile to="/transportation" eyebrow="Transport" title="Cabs, travellers and coaches" icon={Bus} className="h-full" />
          </Reveal>
          <Reveal className="md:col-span-3">
            <Tile to="/domestic-tours" eyebrow="Tours" title="India, curated" text="Kashi to Kerala, Goa to the Chardham." image="/images/site/hero-bg.webp" icon={Compass} className="h-full" />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-3">
            <Tile to="/services/corporate" eyebrow="Corporate and MICE" title="Offsites and travel desks" image="/images/site/corporate-event-premium.webp" icon={Briefcase} className="h-full" />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-gold/10 bg-ink-900/40 py-24 md:py-32">
        <div className="glow-gold pointer-events-none absolute -left-40 top-10 h-96 w-96" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Partner hotels" title="Where we would stay." />
            <Link to="/hotels" className="mb-10 inline-flex items-center gap-2 text-sm text-gold md:mb-14">
              View all hotels <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-ink-800/60" />)}
            </div>
          ) : hotels.length ? (
            <Carousel label="Featured hotels">
              {hotels.map((h) => <HotelCard key={h.slug} hotel={h} />)}
            </Carousel>
          ) : (
            <p className="text-pearl/60">New partner hotels are being added. <Link to="/contact" className="text-gold">Ask us for a stay</Link>.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-gold/10 bg-gold/10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(([title, text], i) => (
            <Reveal key={title} delay={i * 0.06} className="bg-ink-950 p-7 md:p-9">
              <p className="font-display text-4xl text-gold">{title}</p>
              <p className="mt-3 text-sm leading-relaxed text-pearl/60">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-5 mb-24 overflow-hidden rounded-[2rem] border border-gold/15 md:mx-8 md:mb-32">
        <ParallaxImage src="/images/site/hotel-management-bg.webp" alt="" amount={70} className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink-950/80" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <p className="eyebrow mb-5">Start here</p>
          <h2 className="font-display text-4xl leading-tight text-pearl md:text-6xl">{content.cta_title || 'Tell us where. We will handle the rest.'}</h2>
          <p className="mx-auto mt-5 max-w-xl text-pearl/70">
            {content.cta_description || 'Send your dates and group size on WhatsApp and a planner replies with options that fit.'}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <MagneticButton variant="whatsapp" href={whatsappUrl('Hi Zen World Hospitality, I would like to plan a trip.')} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </MagneticButton>
            <MagneticButton variant="ghost" to="/plan-trip">
              <Sparkles className="h-4 w-4" /> Try the AI planner
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
