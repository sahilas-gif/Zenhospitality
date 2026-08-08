import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images = [], startIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const goNext = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2">
        <X className="w-8 h-8" />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 text-white/80 hover:text-white p-2 z-10">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 text-white/80 hover:text-white p-2 z-10">
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      <img
        src={images[current]}
        alt={`Gallery ${current + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="absolute bottom-6 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageGallery;
