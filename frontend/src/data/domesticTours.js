// Domestic (India) tour destinations — sourced from the "Premium Uttar Pradesh
// Religious Tours" offer in Zen-World-Hospitality-Up.html.
//
// Edit this module to change what the Domestic Tours page and navigation show.

const P = (seed, w = 800, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Shared comfort & darshan standards advertised across all circuits.
export const tourFacilities = [
  'Handpicked 3★/4★ hotels & satvik dharmashalas within 500m of temples',
  'Pure Veg Sattvik meals — breakfast + dinner (Jain available)',
  'VIP Darshan Assist — guided, sugam line, panda assistance at Kashi & Ayodhya',
  'Spiritual add-ons — Ganga Aarti seating, Saryu Aarti, Tulsi mala, chandan',
  '24x7 tour manager, first-aid, senior-citizen friendly, wheelchair on request',
  'Comfort vehicles — Dzire, Ertiga, Innova Crysta, Tempo Traveller, Mini Coach',
];

export const tourAddons = ['Naimisharanya', 'Vindhyachal', 'Lucknow', 'Chitrakoot', 'Shravasti'];

export const domesticTours = [
  {
    id: 'sacred-circuit',
    title: 'Sacred Circuit — Kashi • Prayag • Ayodhya • Braj',
    slug: 'sacred-circuit-7n-8d',
    route: 'Varanasi – Prayagraj – Ayodhya – Mathura / Vrindavan',
    duration: '7 Nights / 8 Days Spiritual Yatra',
    destination: 'Uttar Pradesh',
    description:
      'A handcrafted pilgrimage circuit — Kashi to Sangam to Ram Janmabhoomi to Shri Dham Vrindavan. Premium stays, satvik meals and guided darshan.',
    image: P('kashi-ganga-aarti'),
    price: null,
    rating: 4.9,
    isFlagship: true,
    highlights: [
      'Evening Ganga Aarti at Dashashwamedh Ghat, Varanasi',
      'Kashi Vishwanath Jyotirlinga & Sarnath (first sermon of Buddha)',
      'Holy dip at Triveni Sangam, Prayagraj',
      'VIP-assisted Ram Mandir darshan, Ayodhya',
      'Banke Bihari, Prem Mandir light show & ISKCON, Vrindavan',
    ],
    itinerary: [
      { day: 1, title: 'Arrival Varanasi', desc: 'Divine welcome in Kashi. Evening Ganga Aarti at Dashashwamedh Ghat – witness 1000 diyas, conch, chants. Stay in Varanasi.' },
      { day: 2, title: 'Kashi Vishwanath & Sarnath', desc: 'Subah-e-Banaras boat ride, Kashi Vishwanath Jyotirlinga darshan, Sankat Mochan, Kaal Bhairav, Sarnath (Dhamek Stupa & Buddha’s first sermon).' },
      { day: 3, title: 'Varanasi → Prayagraj', desc: 'Drive to Tirthraj Prayag. Holy dip at Triveni Sangam, Bade Hanuman Mandir, Alopi Shankari Shakti Peeth, Akshayavat.' },
      { day: 4, title: 'Prayagraj → Ayodhya', desc: 'Journey to Shri Ram Janmabhoomi. VIP-assisted darshan at Ram Mandir, Hanuman Garhi, Kanak Bhawan. Serene Saryu Aarti at sunset.' },
      { day: 5, title: 'Ayodhya → Braj via Naimisharanya', desc: 'Optional detour — Naimisharanya Chakra Tirtha or Chitrakoot. Overnight comfort halt (~480 km) at a planned Lucknow family hotel.' },
      { day: 6, title: 'Mathura & Vrindavan', desc: 'Shri Krishna Janmabhoomi, Dwarkadhish, Banke Bihari, Prem Mandir light show, ISKCON, Radha Raman. Parikrama & Braj ras.' },
      { day: 7, title: 'Vindhyachal & Departure Prep', desc: 'Vindhyavasini Shakti Peeth darshan (Maa Vindhyachal). Shopping — Banarasi silk, Tulsi mala, Peda.' },
      { day: 8, title: 'Departure', desc: 'Prashad & blessings packed. Transfer to Varanasi (VNS) / Lucknow (LKO) airport or station. Tour ends with Zen’s Namaste.' },
    ],
  },
  {
    id: 'braj-yatra',
    title: 'Braj Yatra — Mathura • Vrindavan • Goverdhan • Barsana',
    slug: 'braj-yatra',
    route: 'Mathura – Vrindavan – Goverdhan – Barsana',
    duration: 'Tailored duration',
    destination: 'Uttar Pradesh (Braj & Shri Dham)',
    description:
      'Walk the land of Krishna — Goverdhan parikrama and Barsana pushkarini, graced by Braj ras and darshan of the most venerated Shri Dham temples.',
    image: P('braj-vrindavan'),
    price: null,
    rating: 4.8,
    highlights: [
      'Shri Krishna Janmabhoomi & Dwarkadhish, Mathura',
      'Banke Bihari, Prem Mandir light show & ISKCON, Vrindavan',
      'Goverdhan parikrama & Barsana Radha Rani temple',
      'Radha Raman & parikrama with authentic Braj presence',
    ],
  },
  {
    id: 'awadh-darshan',
    title: 'Awadh Darshan — Ayodhya • Chitrakoot • Prayagraj • Varanasi',
    slug: 'awadh-darshan',
    route: 'Ayodhya – Chitrakoot – Prayagraj – Varanasi',
    duration: 'Tailored duration',
    destination: 'Uttar Pradesh (Awadh & Sangam)',
    description:
      'A serene Ramkatha circuit — Ram Janmabhoomi in Ayodhya, the banks of Chitrakoot, holy dip at Sangam and darshan of Kashi Vishwanath.',
    image: P('ayodhya-rammandir'),
    price: null,
    rating: 4.8,
    highlights: [
      'Ram Mandir, Hanuman Garhi & Kanak Bhawan, Ayodhya',
      'Saryu Aarti & serene banks of Chitrakoot',
      'Triveni Sangam holy dip, Prayagraj',
      'Kashi Vishwanath Jyotirlinga, Varanasi',
    ],
  },
  {
    id: 'divine-triangle',
    title: 'Divine Triangle — Varanasi • Prayagraj • Ayodhya',
    slug: 'divine-triangle',
    route: 'Varanasi – Prayagraj – Ayodhya – Varanasi',
    duration: 'Ideal weekend',
    destination: 'Uttar Pradesh (Kashi • Prayag • Awadh)',
    description:
      'The perfect short spiritual escape — Kashi’s aarti, Sangam’s holy dip and Ayodhya’s Ram Mandir, timed for elders and weekend travellers.',
    image: P('kashi-sangam'),
    price: null,
    rating: 4.7,
    highlights: [
      'Dashashwamedh Ghat aarti, Varanasi',
      'Triveni Sangam, Prayagraj',
      'Ram Mandir, Ayodhya',
      'Flexible pick-up — VNS / PRYJ / LKO / DEL',
    ],
  },
];

export const sacredCircuitItinerary = domesticTours[0];