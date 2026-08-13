const tours = [
  {
    id: 'mumbai-one-day',
    title: 'Mumbai One Day City Tour',
    slug: 'mumbai-one-day',
    state: 'Maharashtra',
    route: 'Gateway of India • Marine Drive • Dhobi Ghat',
    duration: '1 Day',
    destination: 'Mumbai',
    description: 'Curated private day tour by Zen World Hospitality — local experts, verified stays, chauffeur-driven comfort.',
    highlights: ['Gateway of India', 'Marine Drive', 'Siddhivinayak Temple', 'Dhobi Ghat'],
    itinerary: [
      { day: 1, title: 'Mumbai Darshan', desc: 'Explore Gateway of India, Marine Drive, Siddhivinayak Temple, and Dhobi Ghat. 8 Hrs (9 AM - 5 PM).' }
    ],
    facilities: ['AC Sedan/SUV', 'Professional Driver', 'Toll & Parking', 'Water Bottles', 'Local Guide Support'],
    price: '2499',
    rating: 4.8,
    image: 'https://picsum.photos/seed/mumbai-one-day/800/900'
  },
  {
    id: 'mumbai-2d-1n-explorer',
    title: 'Mumbai 2D / 1N Explorer',
    slug: 'mumbai-2d-1n-explorer',
    state: 'Maharashtra',
    route: 'City Tour + Elephanta Caves',
    duration: '1 Night / 2 Days',
    destination: 'Mumbai',
    description: 'All One Day highlights + Elephanta Caves Ferry, CSMT Heritage Walk, Colaba Shopping and 1N Hotel stay.',
    highlights: ['Gateway of India', 'Elephanta Caves Ferry', 'CSMT Heritage Walk', 'Colaba Shopping'],
    itinerary: [
      { day: 1, title: 'Elephanta Caves & Colaba', desc: 'Elephanta Caves Ferry (08:30 AM), Trimurti Darshan. Return for lunch at Colaba. CSMT & Heritage Walk. Shopping & Leisure.' },
      { day: 2, title: 'Mumbai City Tour', desc: 'Marine Drive, Siddhivinayak, Dhobi Ghat, Bandra-Worli Sea Link.' }
    ],
    facilities: ['Hotel with Breakfast', 'AC Transport', 'Elephanta Ferry Tickets', 'Airport Pickup'],
    price: '5499',
    rating: 4.8,
    image: 'https://picsum.photos/seed/mumbai-2d-1n-explorer/800/900'
  },
  {
    id: 'mumbai-3d-2n-premium',
    title: 'Mumbai 3D / 2N Premium',
    slug: 'mumbai-3d-2n-premium',
    state: 'Maharashtra',
    route: 'Complete City + Elephanta + Bandra-Worli',
    duration: '2 Nights / 3 Days',
    destination: 'Mumbai',
    description: 'A premium 3-day exploration covering the complete city highlights with a premium stay.',
    highlights: ['Complete City', 'Elephanta Caves', 'Bandra-Worli', 'Jehangir Art Gallery', 'Sunset at Marine Drive'],
    itinerary: [
      { day: 1, title: 'Elephanta & South Mumbai', desc: 'Elephanta Caves Ferry, Trimurti Darshan. Lunch at Colaba. CSMT Walk.' },
      { day: 2, title: 'Art & Heritage', desc: 'Jehangir Art Gallery, Gateway of India, Sunset at Marine Drive.' },
      { day: 3, title: 'Bandra & Beyond', desc: 'Bandra-Worli Sea Link, Siddhivinayak, Dhobi Ghat, Shopping. Departure.' }
    ],
    facilities: ['2N Premium Hotel', 'Daily Breakfast', 'Innova Crysta', 'Elephanta & Entry Fees', '24x7 Concierge'],
    price: '8999',
    rating: 4.9,
    image: 'https://picsum.photos/seed/mumbai-3d-2n-premium/800/900'
  }
];

export default tours;
