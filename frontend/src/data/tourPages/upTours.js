const tours = [
  {
    id: 'up-spiritual-triangle',
    title: 'Spiritual Triangle',
    slug: 'up-spiritual-triangle',
    state: 'Uttar Pradesh',
    route: 'Varanasi - Ayodhya - Prayagraj',
    duration: '5 Nights / 6 Days',
    destination: 'Uttar Pradesh',
    description: 'Handcrafted spiritual journey across Varanasi, Ayodhya, and Prayagraj. Private chauffeur, verified stays near temples & ghats.',
    highlights: ['Ganga Aarti', 'Ram Mandir', 'Triveni Sangam', 'Sarnath'],
    itinerary: [
      { day: 1, title: 'Arrival Varanasi', desc: 'Private transfer to hotel near Assi Ghat. Evening boat ride for the divine Ganga Aarti at Dashashwamedh Ghat.' },
      { day: 2, title: 'Kashi Vishwanath & Sarnath', desc: 'Early Mangala Aarti, Kashi Vishwanath corridor darshan, Kal Bhairav. Afternoon Sarnath.' },
      { day: 3, title: 'Varanasi to Prayagraj', desc: 'Drive via Chunar. Holy dip at Triveni Sangam, Akshayavat, Bade Hanuman Ji. Sunset at Yamuna bank.' },
      { day: 4, title: 'Prayagraj to Ayodhya', desc: 'Scenic 4hr drive. Check-in near temple. Evening Ram Mandir darshan, Hanuman Garhi climb.' },
      { day: 5, title: 'Ayodhya Spiritual Depth', desc: 'Sarayu Snan, Kanak Bhawan, Dashrath Mahal. Evening Sarayu Aarti with pandit assistance.' },
      { day: 6, title: 'Departure', desc: 'After breakfast, transfer to airport/station with blessings.' }
    ],
    facilities: ['AC Chauffeur', 'Verified Stay', 'Daily Breakfast + 1 Dinner', 'Private Boat', 'Pandit for Puja & Prasad'],
    price: '18999',
    rating: 4.9,
    image: 'https://picsum.photos/seed/up-spiritual-triangle/800/900'
  },
  {
    id: 'up-royal-heritage',
    title: 'Royal Heritage',
    slug: 'up-royal-heritage',
    state: 'Uttar Pradesh',
    route: 'Agra - Lucknow',
    duration: '4 Nights / 5 Days',
    destination: 'Uttar Pradesh',
    description: 'Explore the legacy of Agra and Lucknow with heritage walks, sunrise at the Taj, and Nawabi feasts.',
    highlights: ['Taj Sunrise', 'Bara Imambara', 'Chikankari', 'Nawabi Feast'],
    itinerary: [
      { day: 1, title: 'Arrival Agra', desc: 'Welcome at Agra. Check-in to hotel. Visit Agra Fort and local markets.' },
      { day: 2, title: 'Taj Mahal Sunrise & Fatehpur Sikri', desc: 'Early morning guided Taj Mahal tour. Excursion to Fatehpur Sikri.' },
      { day: 3, title: 'Agra to Lucknow', desc: 'Drive to Lucknow via Expressway. Evening Hazratganj walk and Nawabi feast.' },
      { day: 4, title: 'Lucknow Heritage', desc: 'Bara Imambara, Rumi Darwaza, Chota Imambara, and Chikankari shopping.' },
      { day: 5, title: 'Departure', desc: 'Transfer to Lucknow Airport/Station.' }
    ],
    facilities: ['AC Chauffeur', 'Verified Stay', 'Daily Breakfast', 'Local Guides'],
    price: '16499',
    rating: 4.8,
    image: 'https://picsum.photos/seed/up-royal-heritage/800/900'
  },
  {
    id: 'up-braj-bhumi',
    title: 'Braj Bhumi Darshan',
    slug: 'up-braj-bhumi',
    state: 'Uttar Pradesh',
    route: 'Mathura - Vrindavan - Barsana',
    duration: '3 Nights / 4 Days',
    destination: 'Uttar Pradesh',
    description: 'Immerse in the festive soul of Lord Krishna\'s birthplace with our curated Braj Bhumi Darshan.',
    highlights: ['Banke Bihari', 'Prem Mandir', 'Govardhan', 'Yamuna Aarti'],
    itinerary: [
      { day: 1, title: 'Mathura Arrival', desc: 'Check-in. Shri Krishna Janmasthan Temple and evening Yamuna Aarti.' },
      { day: 2, title: 'Vrindavan Divya Darshan', desc: 'Banke Bihari Temple, ISKCON, Prem Mandir lighting.' },
      { day: 3, title: 'Govardhan & Barsana', desc: 'Govardhan Parikrama (by e-rickshaw), Radha Rani Temple in Barsana.' },
      { day: 4, title: 'Departure', desc: 'Morning darshan and onward journey.' }
    ],
    facilities: ['AC Chauffeur', 'Verified Stay', 'Daily Breakfast', 'E-rickshaw Assistance'],
    price: '12999',
    rating: 4.9,
    image: 'https://picsum.photos/seed/up-braj-bhumi/800/900'
  },
  {
    id: 'up-divya-ayodhya',
    title: 'Divya Ayodhya Special',
    slug: 'up-divya-ayodhya',
    state: 'Uttar Pradesh',
    route: 'Ayodhya Dham',
    duration: '2 Nights / 3 Days',
    destination: 'Uttar Pradesh',
    description: 'A short escape to the divine city of Ayodhya. Includes priority darshan at Ram Mandir.',
    highlights: ['Ram Mandir', 'Hanuman Garhi', 'Sarayu Aarti', 'Kanak Bhawan'],
    itinerary: [
      { day: 1, title: 'Arrival Ayodhya', desc: 'Check-in near the temple. Evening Sarayu Aarti and ghat walk.' },
      { day: 2, title: 'Ram Mandir Darshan', desc: 'Sunrise priority darshan at Ram Mandir. Hanuman Garhi, Kanak Bhawan, Dashrath Mahal.' },
      { day: 3, title: 'Departure', desc: 'Morning local sightseeing and transfer to airport/station.' }
    ],
    facilities: ['AC Chauffeur', 'Verified Stay', 'Daily Breakfast', 'Pandit for Puja'],
    price: '8999',
    rating: 4.9,
    image: 'https://picsum.photos/seed/up-divya-ayodhya/800/900'
  },
  {
    id: 'up-kashi-prayag',
    title: 'Kashi Prayag Expedition',
    slug: 'up-kashi-prayag',
    state: 'Uttar Pradesh',
    route: 'Varanasi - Prayagraj',
    duration: '3 Nights / 4 Days',
    destination: 'Uttar Pradesh',
    description: 'A peaceful circuit covering the ghats of Varanasi and the holy sangam at Prayagraj.',
    highlights: ['Kashi Vishwanath', 'Triveni Snan', 'Sarnath', 'Boat Ride'],
    itinerary: [
      { day: 1, title: 'Arrival Varanasi', desc: 'Hotel check-in. Evening boat ride for Ganga Aarti at Dashashwamedh Ghat.' },
      { day: 2, title: 'Kashi Darshan & Sarnath', desc: 'Mangala Aarti, Kashi Vishwanath. Afternoon Sarnath excursion.' },
      { day: 3, title: 'Prayagraj Sangam', desc: 'Day trip to Prayagraj. Triveni Sangam snan, Bade Hanuman Ji.' },
      { day: 4, title: 'Departure', desc: 'Morning at leisure and departure.' }
    ],
    facilities: ['AC Chauffeur', 'Verified Stay', 'Daily Breakfast', 'Private Boat'],
    price: '13499',
    rating: 4.8,
    image: 'https://picsum.photos/seed/up-kashi-prayag/800/900'
  },
  {
    id: 'up-grand-circuit',
    title: 'Grand UP Circuit',
    slug: 'up-grand-circuit',
    state: 'Uttar Pradesh',
    route: 'Agra - Mathura - Lucknow - Varanasi - Ayodhya - Prayagraj',
    duration: '9 Nights / 10 Days',
    destination: 'Uttar Pradesh',
    description: 'The ultimate 10-day expedition exploring all 6 major cities of UP: Agra, Mathura, Lucknow, Varanasi, Ayodhya, and Prayagraj.',
    highlights: ['All 6 Cities', 'Taj & Ghats', 'Temples & Heritage', 'Private Guide'],
    itinerary: [
      { day: 1, title: 'Arrival Agra', desc: 'Taj Mahal and Agra Fort.' },
      { day: 2, title: 'Agra to Mathura', desc: 'Explore Mathura and Vrindavan temples.' },
      { day: 3, title: 'Mathura to Lucknow', desc: 'Drive to Lucknow. Evening heritage walk.' },
      { day: 4, title: 'Lucknow Sightseeing', desc: 'Imambaras, Rumi Darwaza. Overnight journey to Varanasi/Ayodhya.' },
      { day: 5, title: 'Varanasi Arrival', desc: 'Check-in, evening Ganga Aarti.' },
      { day: 6, title: 'Kashi Vishwanath', desc: 'Temple darshan and Sarnath.' },
      { day: 7, title: 'Varanasi to Prayagraj', desc: 'Triveni Sangam holy dip. Overnight Prayagraj.' },
      { day: 8, title: 'Prayagraj to Ayodhya', desc: 'Check-in Ayodhya. Evening Sarayu Aarti.' },
      { day: 9, title: 'Ayodhya Darshan', desc: 'Ram Mandir, Hanuman Garhi, Kanak Bhawan.' },
      { day: 10, title: 'Departure', desc: 'End of Grand Circuit. Transfer to airport/station.' }
    ],
    facilities: ['AC Chauffeur', 'Verified Stay', 'Daily Breakfast', 'Private Boat', 'Private Guide'],
    price: '34999',
    rating: 4.9,
    image: 'https://picsum.photos/seed/up-grand-circuit/800/900'
  }
];

export default tours;
