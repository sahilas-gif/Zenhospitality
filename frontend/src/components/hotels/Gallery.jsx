import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Grid2x2, X } from 'lucide-react';
import Picture from '../ui/Picture';
import { setScrollLocked } from '../../lib/scroll';

function Lightbox({ images, index, onClose, onIndex }) {
  const closeRef = useRef(null);
  const go = useCallback((d) => onIndex((index + d + images.length) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    setScrollLocked(true);
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      setScrollLocked(false);
    };
  }, [go, onClose]);

  const img = images[index];
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] flex flex-col bg-ink-950/95 backdrop-blur"
    >
      <div className="flex items-center justify-between p-4 text-sm text-pearl/70">
        <span aria-live="polite">{index + 1} / {images.length}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery" className="grid h-11 w-11 place-items-center rounded-full border border-gold/20 text-pearl">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
        <Picture key={img.url} src={img.url} alt={img.alt} className="block max-h-full" imgClassName="max-h-[78dvh] w-auto rounded-2xl object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-ink-900/80 text-pearl md:left-8"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-ink-900/80 text-pearl md:right-8"><ChevronRight className="h-5 w-5" /></button>
          </>
        )}
      </div>
      {img.alt && <p className="pb-6 text-center text-sm text-pearl/60">{img.alt}</p>}
    </motion.div>
  );
}

export default function Gallery({ images = [], name }) {
  const [open, setOpen] = useState(null);
  if (!images.length) return <div className="glow-gold aspect-[16/9] rounded-[2rem] border border-gold/10" />;
  const [first, ...rest] = images;

  return (
    <>
      <div className="grid gap-3 md:h-[34rem] md:grid-cols-4 md:grid-rows-2">
        <button type="button" onClick={() => setOpen(0)} className="group relative overflow-hidden rounded-[1.75rem] md:col-span-2 md:row-span-2" aria-label={`Open photos of ${name}`}>
          <Picture src={first.url} alt={first.alt || name} priority className="block aspect-[4/3] h-full w-full md:aspect-auto" imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
        </button>
        {rest.slice(0, 4).map((img, i) => (
          <button key={img.url} type="button" onClick={() => setOpen(i + 1)} className="group relative hidden overflow-hidden rounded-[1.5rem] md:block" aria-label={img.alt || `Photo ${i + 2}`}>
            <Picture src={img.url} alt={img.alt} className="block h-full w-full" imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06]" />
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 grid place-items-center bg-ink-950/55 font-display text-2xl text-pearl">+{images.length - 5}</span>
            )}
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <button type="button" onClick={() => setOpen(0)} className="hairline mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-pearl/80 hover:text-pearl">
          <Grid2x2 className="h-4 w-4" /> View all {images.length} photos
        </button>
      )}
      <AnimatePresence>
        {open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
