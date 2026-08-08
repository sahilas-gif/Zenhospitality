import { Heart } from 'lucide-react';

const WishlistButton = ({ packageId, isWishlisted, onToggle }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onToggle(packageId); }}
    className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-sm"
    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
  >
    <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
  </button>
);

export default WishlistButton;
