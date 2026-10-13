import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

// Native scroll-snap track: swipe on touch, arrow buttons and keyboard on desktop.
export default function Carousel({ children, label, itemClassName = 'w-[82%] sm:w-[46%] lg:w-[31%]' }) {
  const track = useRef(null);
  const scroll = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        tabIndex={0}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 focus-visible:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') scroll(1);
          if (e.key === 'ArrowLeft') scroll(-1);
        }}
      >
        {[].concat(children).map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
      <div className="mt-6 hidden justify-end gap-2 md:flex">
        <button type="button" aria-label="Previous" onClick={() => scroll(-1)} className="hairline grid h-11 w-11 place-items-center rounded-full text-pearl/80 transition-colors hover:bg-gold hover:text-ink-950">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Next" onClick={() => scroll(1)} className="hairline grid h-11 w-11 place-items-center rounded-full text-pearl/80 transition-colors hover:bg-gold hover:text-ink-950">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
