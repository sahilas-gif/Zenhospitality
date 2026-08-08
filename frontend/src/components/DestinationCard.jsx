import { useState } from 'react';
import { MapPin, Clock, Check } from 'lucide-react';

const FALLBACK = 'https://picsum.photos/seed/fallback/800/800';

// DestinationCard — used on the Domestic Tours page. Mirrors the visual style
// of PackageCard but is tailored to present a tour circuit's route.
const DestinationCard = ({ tour, onEnquire }) => {
  const [imgSrc, setImgSrc] = useState(tour.image || null);

  return (
    <div className="flex flex-col group cursor-pointer" onClick={() => onEnquire(tour)}>
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-3">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(FALLBACK)}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        {tour.isFlagship && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Signature Tour
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-base font-semibold text-white leading-tight">{tour.title}</h4>
          <div className="flex items-center text-sm text-gray-300 flex-shrink-0">
            ★ <span className="ml-1">{tour.rating ? tour.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-400 text-sm mt-1 gap-1">
          <MapPin className="w-3.5 h-3.5" /> <span>{tour.destination}</span>
        </div>
        <div className="flex items-center text-gray-400 text-sm mt-1 gap-1">
          <Clock className="w-3.5 h-3.5" /> <span>{tour.duration}</span>
        </div>

        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{tour.route}</p>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{tour.description}</p>

        <ul className="mt-3 space-y-1.5">
          {tour.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start text-gray-300 text-[13px]">
              <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 pt-3 border-t border-gray-800 text-sm">
          <span className="text-emerald-400 font-semibold">Enquire</span>
          <span className="text-gray-600"> · Custom pricing</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;