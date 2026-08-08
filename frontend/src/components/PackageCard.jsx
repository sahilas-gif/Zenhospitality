import { useState } from 'react';
import WishlistButton from './WishlistButton';

const FALLBACK = 'https://picsum.photos/seed/fallback/800/800';

const PackageCard = ({ pkg, onEnquire, isWishlisted, onToggleWishlist }) => {
  const [imgSrc, setImgSrc] = useState(pkg.image || null);

  return (
    <div className="flex flex-col group cursor-pointer" onClick={() => onEnquire(pkg)}>
      {/* Image Container - Aspect Ratio 1:1 */}
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-3">
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={pkg.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            loading="lazy" 
            referrerPolicy="no-referrer" 
            onError={() => setImgSrc(FALLBACK)} 
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        
        {/* Floating Heart Button */}
        <WishlistButton packageId={pkg.id} isWishlisted={isWishlisted} onToggle={(e) => { e.stopPropagation(); onToggleWishlist(e); }} />
        
        {/* Optional Category Badge */}
        {pkg.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {pkg.category.replace('_', ' ')}
          </div>
        )}
      </div>

      {/* Text Content - No padding, no background */}
      <div className="flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start">
          <h4 className="text-base font-semibold text-white leading-tight">{pkg.title}</h4>
          <div className="flex items-center text-sm text-gray-300 flex-shrink-0 ml-2">
            ★ <span className="ml-1">{pkg.rating > 0 ? pkg.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>
        
        {pkg.destination && (
          <p className="text-gray-400 text-sm mt-0.5">{pkg.destination}</p>
        )}
        
        <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{pkg.description}</p>

        <div className="mt-2 text-sm">
          <span className="font-semibold text-white">{pkg.price ? `₹${pkg.price.toLocaleString()}` : 'Custom Pricing'}</span>
          {pkg.price && <span className="text-gray-400"> total</span>}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
