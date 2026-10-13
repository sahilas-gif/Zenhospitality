import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import Picture from '../ui/Picture';

export function RateBadge({ hotel, className = '' }) {
  const price = Number(hotel.price_from);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-ink-950/75 px-3 py-1.5 text-xs text-pearl backdrop-blur ${className}`}>
      {price > 0 ? (
        <>From <strong className="font-semibold text-gold">₹{price.toLocaleString('en-IN')}</strong></>
      ) : (
        <strong className="font-semibold text-gold">Get best rate</strong>
      )}
    </span>
  );
}

export default function HotelCard({ hotel, priority = false }) {
  const cover = hotel.images?.[0];
  return (
    <Link to={`/hotels/${hotel.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ink-900">
        {cover ? (
          <Picture
            src={cover.url}
            alt={cover.alt || hotel.name}
            priority={priority}
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="glow-gold h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <span className="rounded-full border border-gold/30 bg-ink-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold backdrop-blur">
            Best rates via Zen
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-pearl/10 text-pearl opacity-0 backdrop-blur transition-[opacity,transform] duration-500 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="flex items-center gap-1.5 text-xs text-pearl/70">
            <MapPin className="h-3.5 w-3.5 text-gold" /> {[hotel.locality, hotel.city].filter(Boolean).join(', ')}
            {hotel.star_rating ? (
              <span className="ml-2 flex items-center gap-0.5 text-gold">
                {hotel.star_rating}<Star className="h-3 w-3 fill-gold" />
              </span>
            ) : null}
          </p>
          <h3 className="mt-2 font-display text-3xl leading-tight text-pearl">{hotel.name}</h3>
          {hotel.summary && <p className="mt-2 line-clamp-2 text-sm text-pearl/60">{hotel.summary}</p>}
          <RateBadge hotel={hotel} className="mt-4" />
        </div>
      </div>
    </Link>
  );
}
