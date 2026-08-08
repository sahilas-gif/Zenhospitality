// Using picsum.photos — 100% reliable, no CORS, always works
const P = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const PL = (seed) => `https://picsum.photos/seed/${seed}/1920/1080`;

export const IMAGES = {
  hero: PL('zen-hero'),
  maldives: P('maldives-luxury'),
  goa: P('goa-beach'),
  hotel: P('hotel-luxury'),
  europe: P('europe-travel'),
  dubai: P('dubai-city'),
  preopening: P('hotel-preopen'),
  bali: P('bali-temple'),
  rajasthan: P('rajasthan-palace'),
  kerala: P('kerala-backwater'),
  corporate: P('corporate-event'),
  beach: P('tropical-beach'),
  luxury: P('luxury-resort'),
  pool: P('infinity-pool'),
  sunset: P('sunset-cruise'),
  food: P('fine-dining'),
  spa: P('spa-treatment'),
  meeting: P('business-meeting'),
  resort: P('pool-resort'),
  villa: P('villa-pool'),
  travel: P('travel-adventure'),
  landscape: P('mountain-landscape'),
  adventure: P('alps-adventure'),
  dining: P('romantic-dinner'),
  room: P('hotel-room'),
  infinity: P('infinity-edge'),
  explore: P('world-explore'),
  modern: P('modern-arch'),
  indoor: P('indoor-event'),
  paris: P('paris-street'),
  thai: P('thailand-beach'),
};

export const fallbackPackages = [
  {
    id: 1, title: 'Maldives Luxury Retreat', category: 'travel_booking', duration: '5 Days / 4 Nights', price: 125000,
    rating: 4.8, reviewCount: 124,
    description: 'Experience overwater bungalows, crystal-clear waters, and world-class dining in the Maldives.',
    image: IMAGES.maldives, destination: 'Maldives',
    images: [IMAGES.maldives, IMAGES.pool, IMAGES.sunset, IMAGES.villa],
  },
  {
    id: 2, title: 'Corporate Goa Offsite', category: 'corporate', duration: '3 Days / 2 Nights', price: 45000,
    rating: 4.6, reviewCount: 89,
    description: 'A productive offsite with beachside meetings, team-building, and premium accommodations.',
    image: IMAGES.goa, destination: 'Goa, India',
    images: [IMAGES.goa, IMAGES.beach, IMAGES.meeting, IMAGES.resort],
  },
  {
    id: 3, title: 'Boutique Hotel Revenue Audit', category: 'hotel_management', duration: '1 Month', price: null,
    rating: 4.9, reviewCount: 56,
    description: 'Comprehensive revenue audit and optimization strategy for boutique properties.',
    image: IMAGES.hotel, destination: 'Pan India',
    images: [IMAGES.hotel, IMAGES.luxury, IMAGES.room, IMAGES.modern],
  },
  {
    id: 4, title: 'European Honeymoon Package', category: 'travel_booking', duration: '10 Days / 9 Nights', price: 250000,
    rating: 4.9, reviewCount: 203,
    description: 'Romantic journey through Paris, Venice, and Santorini with luxury accommodations.',
    image: IMAGES.europe, destination: 'Europe',
    images: [IMAGES.europe, IMAGES.food, IMAGES.sunset, IMAGES.dining],
  },
  {
    id: 5, title: 'Dubai Annual MICE Summit', category: 'corporate', duration: '4 Days / 3 Nights', price: 85000,
    rating: 4.7, reviewCount: 67,
    description: 'Full-service MICE summit with conference facilities, excursions, and gala dinner.',
    image: IMAGES.dubai, destination: 'Dubai, UAE',
    images: [IMAGES.dubai, IMAGES.luxury, IMAGES.meeting, IMAGES.indoor],
  },
  {
    id: 6, title: 'Pre-Opening Hotel Strategy', category: 'hotel_management', duration: '3 Months', price: null,
    rating: 4.8, reviewCount: 42,
    description: 'End-to-end pre-opening advisory from concept to grand opening.',
    image: IMAGES.preopening, destination: 'Pan India',
    images: [IMAGES.preopening, IMAGES.hotel, IMAGES.modern, IMAGES.room],
  },
  {
    id: 7, title: 'Bali Wellness Retreat', category: 'travel_booking', duration: '7 Days / 6 Nights', price: 85000,
    rating: 4.7, reviewCount: 158,
    description: 'Rejuvenate with yoga, meditation, spa treatments, and Balinese cultural experiences.',
    image: IMAGES.bali, destination: 'Bali, Indonesia',
    images: [IMAGES.bali, IMAGES.spa, IMAGES.pool, IMAGES.infinity],
  },
  {
    id: 8, title: 'Rajasthan Royal Tour', category: 'travel_booking', duration: '8 Days / 7 Nights', price: 95000,
    rating: 4.8, reviewCount: 176,
    description: 'Explore majestic forts, palaces, and vibrant bazaars across the Land of Kings.',
    image: IMAGES.rajasthan, destination: 'Rajasthan, India',
    images: [IMAGES.rajasthan, IMAGES.food, IMAGES.landscape, IMAGES.explore],
  },
  {
    id: 9, title: 'Kerala Backwaters Escape', category: 'travel_booking', duration: '5 Days / 4 Nights', price: 55000,
    rating: 4.6, reviewCount: 132,
    description: 'Houseboat cruises, Ayurvedic massage, and lush green landscapes in Gods Own Country.',
    image: IMAGES.kerala, destination: 'Kerala, India',
    images: [IMAGES.kerala, IMAGES.spa, IMAGES.landscape, IMAGES.adventure],
  },
  {
    id: 10, title: 'Swiss Alps Ski Adventure', category: 'travel_booking', duration: '7 Days / 6 Nights', price: 180000,
    rating: 4.9, reviewCount: 94,
    description: 'World-class skiing, cozy chalets, and breathtaking alpine views in the Swiss Alps.',
    image: IMAGES.adventure, destination: 'Switzerland',
    images: [IMAGES.adventure, IMAGES.landscape, IMAGES.travel, IMAGES.food],
  },
  {
    id: 11, title: 'Thailand Beach Paradise', category: 'travel_booking', duration: '6 Days / 5 Nights', price: 65000,
    rating: 4.5, reviewCount: 211,
    description: 'White sand beaches, vibrant nightlife, and exotic Thai cuisine in Phuket & Koh Samui.',
    image: IMAGES.thai, destination: 'Thailand',
    images: [IMAGES.thai, IMAGES.sunset, IMAGES.food, IMAGES.resort],
  },
  {
    id: 12, title: 'Udaipur Royal Wedding Planning', category: 'corporate', duration: 'Custom', price: null,
    rating: 4.9, reviewCount: 38,
    description: 'End-to-end wedding planning at stunning palace venues in the City of Lakes.',
    image: IMAGES.rajasthan, destination: 'Udaipur, India',
    images: [IMAGES.rajasthan, IMAGES.luxury, IMAGES.food, IMAGES.sunset],
  },
];

export const fallbackEnquiries = [
  { id: 1, customer_name: 'John Doe', customer_phone: '+1 234 567 8900', package: { title: 'Maldives Luxury Retreat' }, status: 'new', created_at: '2025-10-25T10:30:00Z', travel_date: '2025-12-15' },
  { id: 2, customer_name: 'Jane Smith', customer_phone: '+44 7700 900077', package: { title: 'Corporate Goa Offsite' }, status: 'contacted', created_at: '2025-10-24T14:20:00Z', travel_date: '2026-01-10' },
  { id: 3, customer_name: 'Rahul Kumar', customer_phone: '+91 98765 43210', package: { title: 'Custom AI Itinerary' }, status: 'closed', created_at: '2025-10-20T09:15:00Z', travel_date: '2025-11-05' },
  { id: 4, customer_name: 'Priya Sharma', customer_phone: '+91 99887 76655', package: { title: 'European Honeymoon Package' }, status: 'converted', created_at: '2025-10-28T16:45:00Z', travel_date: '2026-02-14' },
  { id: 5, customer_name: 'Mike Johnson', customer_phone: '+61 400 123 456', package: { title: 'Bali Wellness Retreat' }, status: 'new', created_at: '2025-11-01T11:00:00Z', travel_date: '2026-03-01' },
];

export const fallbackItinerary = {
  title: 'Magical 5 Days in Paradise',
  description: 'A customized journey focusing on leisure and relaxation fitting within your budget.',
  days: [
    { day: 1, title: 'Arrival & Welcome', activities: ['Airport Transfer', 'Check-in to 5-star resort', 'Welcome Dinner with local cuisine', 'Evening beach stroll'] },
    { day: 2, title: 'Explore & Discover', activities: ['Guided City Tour', 'Local Cuisine Tasting', 'Sunset Cruise with drinks', 'Night market visit'] },
    { day: 3, title: 'Adventure & Relaxation', activities: ['Morning Yoga on the beach', 'Scuba Diving / Snorkeling', 'Spa Treatment', 'Candlelight dinner'] },
    { day: 4, title: 'Cultural Immersion', activities: ['Visit local temples', 'Cooking class', 'Traditional dance performance', 'Beach barbecue'] },
    { day: 5, title: 'Departure', activities: ['Sunrise photoshoot', 'Farewell breakfast', 'Souvenir shopping', 'Airport transfer'] },
  ],
  travel_tips: ['Carry sunscreen and insect repellent', 'Local SIM card recommended', 'Best time to visit is November to March'],
  budget_summary: 'Estimated total: ₹85,000 - ₹1,25,000 per person including accommodation, meals, and activities.',
};

export const reviews = [
  { id: 1, name: 'Arun Mehta', avatar: 'AM', rating: 5, text: 'Absolutely incredible experience! The Maldives package exceeded all expectations. The overwater villa was stunning.', date: '2025-09-15', package: 'Maldives Luxury Retreat' },
  { id: 2, name: 'Sarah Johnson', avatar: 'SJ', rating: 5, text: 'Our corporate offsite in Goa was flawlessly organized. Team building activities were world-class.', date: '2025-08-20', package: 'Corporate Goa Offsite' },
  { id: 3, name: 'Rajesh Kumar', avatar: 'RK', rating: 4, text: 'The European honeymoon package was romantic and well-planned. Every detail was taken care of.', date: '2025-07-10', package: 'European Honeymoon Package' },
  { id: 4, name: 'Emily Chen', avatar: 'EC', rating: 5, text: 'Zen World handled our 200-person conference flawlessly. Highly professional team.', date: '2025-06-05', package: 'Dubai Annual MICE Summit' },
  { id: 5, name: 'Priya Sharma', avatar: 'PS', rating: 5, text: 'The Bali wellness retreat was life-changing. The yoga sessions overlooking the rice terraces were magical.', date: '2025-05-20', package: 'Bali Wellness Retreat' },
  { id: 6, name: 'David Wilson', avatar: 'DW', rating: 4, text: 'Rajasthan Royal Tour was impeccably planned. Every palace visit was seamless.', date: '2025-04-15', package: 'Rajasthan Royal Tour' },
  { id: 7, name: 'Lisa Chen', avatar: 'LC', rating: 5, text: 'Swiss Alps ski trip was beyond amazing! The chalet was cozy and the slopes were perfect.', date: '2025-03-10', package: 'Swiss Alps Ski Adventure' },
  { id: 8, name: 'Amit Patel', avatar: 'AP', rating: 5, text: 'Kerala backwaters cruise was the most peaceful experience of my life. Highly recommend!', date: '2025-02-20', package: 'Kerala Backwaters Escape' },
];
