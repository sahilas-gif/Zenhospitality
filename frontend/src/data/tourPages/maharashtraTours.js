const tours = [
  {
    id: 'maharashtra-jyotirlinga',
    title: '5 Jyotirlinga Yatra',
    slug: 'maharashtra-jyotirlinga',
    state: 'Maharashtra',
    route: 'Trimbakeshwar • Bhimashankar • Grishneshwar • Parli Vaijnath • Aundha Nagnath',
    duration: '6 Nights / 7 Days',
    destination: 'Maharashtra',
    description: 'Complete five-temple Maharashtra Jyotirlinga road circuit with darshan planning, hotels, meals, private vehicles and transfers.',
    highlights: ['Trimbakeshwar', 'Bhimashankar', 'Grishneshwar', 'Parli Vaijnath', 'Aundha Nagnath'],
    itinerary: [
      { day: 1, title: 'Arrival • Nashik / Trimbakeshwar', desc: 'Airport/railway pickup → hotel check-in → Trimbakeshwar Jyotirlinga darshan → Kushavarta Kund → overnight Nashik/Trimbak.' },
      { day: 2, title: 'Nashik → Ellora / Chhatrapati Sambhajinagar', desc: 'Morning departure → Grishneshwar Jyotirlinga darshan → Ellora Caves → hotel check-in → overnight Chhatrapati Sambhajinagar.' },
      { day: 3, title: 'Chhatrapati Sambhajinagar → Parli Vaijnath', desc: 'Breakfast → scenic road journey → Parli Vaijnath Jyotirlinga darshan → local temple area → overnight Parli.' },
      { day: 4, title: 'Parli → Aundha Nagnath', desc: 'Breakfast → Aundha Nagnath Jyotirlinga darshan → optional nearby spiritual sightseeing → overnight Hingoli/Nanded region.' },
      { day: 5, title: 'Aundha Nagnath → Pune Region', desc: 'Long-distance road transfer with comfort breaks → hotel check-in → relaxed evening → overnight Pune.' },
      { day: 6, title: 'Pune → Bhimashankar', desc: 'Early departure → Bhimashankar Jyotirlinga darshan → optional forest/nature experience → overnight Pune/Lonavala.' },
      { day: 7, title: 'Departure', desc: 'Breakfast → transfer to Pune/Mumbai airport or railway station → tour concludes with divine blessings.' }
    ],
    facilities: ['Hotels & Resorts', 'Private Cars / Group Transport', 'Transfers'],
    price: null,
    rating: 4.8,
    image: 'https://picsum.photos/seed/maharashtra-jyotirlinga/800/900'
  },
  {
    id: 'maharashtra-grand',
    title: 'Grand Maharashtra',
    slug: 'maharashtra-grand',
    state: 'Maharashtra',
    route: 'Mumbai • Pune • Hill Stations • Caves',
    duration: '7 Nights / 8 Days',
    destination: 'Maharashtra',
    description: 'A grand tour covering the heritage, hill stations, and iconic caves of Maharashtra.',
    highlights: ['Mumbai City', 'Pune Heritage', 'Mahabaleshwar', 'Ajanta & Ellora Caves'],
    itinerary: [
      { day: 1, title: 'Arrival in Mumbai', desc: 'Check-in and Mumbai city tour (Gateway of India, Marine Drive).' },
      { day: 2, title: 'Mumbai to Pune', desc: 'Drive to Pune. Visit Shaniwar Wada and Aga Khan Palace.' },
      { day: 3, title: 'Pune to Mahabaleshwar', desc: 'Scenic drive to Mahabaleshwar. Visit Venna Lake and viewpoints.' },
      { day: 4, title: 'Mahabaleshwar & Panchgani', desc: 'Explore Pratapgad Fort, Panchgani Table Land.' },
      { day: 5, title: 'Mahabaleshwar to Chhatrapati Sambhajinagar', desc: 'Long drive to Chhatrapati Sambhajinagar (Aurangabad).' },
      { day: 6, title: 'Ajanta Caves', desc: 'Full day excursion to the ancient Buddhist Ajanta Caves.' },
      { day: 7, title: 'Ellora Caves & Daulatabad', desc: 'Visit Ellora Caves, Kailasa Temple, and Daulatabad Fort.' },
      { day: 8, title: 'Departure', desc: 'Transfer to airport/station.' }
    ],
    facilities: ['Hotels & Resorts', 'Private AC Vehicle', 'Daily Breakfast'],
    price: null,
    rating: 4.9,
    image: 'https://picsum.photos/seed/maharashtra-grand/800/900'
  },
  {
    id: 'maharashtra-ajanta-ellora',
    title: 'Ajanta • Ellora',
    slug: 'maharashtra-ajanta-ellora',
    state: 'Maharashtra',
    route: 'Chhatrapati Sambhajinagar Base',
    duration: '2 Nights / 3 Days',
    destination: 'Maharashtra',
    description: 'A focused heritage tour exploring the UNESCO World Heritage sites of Ajanta and Ellora.',
    highlights: ['Ajanta Caves', 'Ellora Caves', 'Bibi Ka Maqbara'],
    itinerary: [
      { day: 1, title: 'Arrival', desc: 'Arrive in Chhatrapati Sambhajinagar. Visit Bibi Ka Maqbara and local markets.' },
      { day: 2, title: 'Ajanta Caves', desc: 'Full day trip to Ajanta Caves to witness ancient Buddhist murals.' },
      { day: 3, title: 'Ellora Caves & Departure', desc: 'Visit Ellora Caves (Kailasa Temple). Departure transfer.' }
    ],
    facilities: ['3-Star/4-Star Hotels', 'Private Transport', 'Guided Tours available'],
    price: null,
    rating: 4.7,
    image: 'https://picsum.photos/seed/maharashtra-ajanta-ellora/800/900'
  },
  {
    id: 'maharashtra-konkan-escape',
    title: 'Konkan Escape',
    slug: 'maharashtra-konkan-escape',
    state: 'Maharashtra',
    route: 'Alibaug • Ganpatipule • Tarkarli',
    duration: '5 Nights / 6 Days',
    destination: 'Maharashtra',
    description: 'Explore the pristine beaches, coastal forts, and delectable cuisine of the Konkan coast.',
    highlights: ['Alibaug Beach', 'Ganpatipule Temple', 'Tarkarli Scuba Diving', 'Sindhudurg Fort'],
    itinerary: [
      { day: 1, title: 'Mumbai/Pune to Alibaug', desc: 'Drive to Alibaug. Visit Kolaba Fort and relax on the beach.' },
      { day: 2, title: 'Alibaug to Ganpatipule', desc: 'Scenic coastal drive. Visit Ganpatipule Temple and pristine beach.' },
      { day: 3, title: 'Ganpatipule to Tarkarli', desc: 'Drive to Tarkarli. Enjoy Konkani seafood and beach sunset.' },
      { day: 4, title: 'Tarkarli Water Sports', desc: 'Engage in scuba diving, snorkeling, and visit Sindhudurg Fort.' },
      { day: 5, title: 'Tarkarli Leisure', desc: 'Relax at Devbagh beach or take a backwater boat ride.' },
      { day: 6, title: 'Departure', desc: 'Drive back to Mumbai/Pune or onward journey.' }
    ],
    facilities: ['Coastal Resorts', 'Private AC Vehicle', 'Daily Breakfast'],
    price: null,
    rating: 4.8,
    image: 'https://picsum.photos/seed/maharashtra-konkan-escape/800/900'
  }
];

export default tours;
