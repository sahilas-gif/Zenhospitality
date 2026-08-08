import { Star } from 'lucide-react';

const ReviewStars = ({ rating = 0, count = 0, size = 14 }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
        />
      ))}
    </div>
    {count > 0 && <span className="text-xs text-gray-400">({count})</span>}
  </div>
);

export default ReviewStars;
