// Zen transport catalogue. Rates are Zen's published indicative rates;
// the final quote is always confirmed on WhatsApp.

export const FLEET_CATEGORIES = ['Cars', 'Tempo Traveller', 'Buses', 'Luxury'];

export const FLEET = [
  { id: 'c1', category: 'Cars', name: 'Swift / Baleno', seater: '4+1 Seater', seats: 4, type: 'Hatchback • AC', ideal: 'City rides & budget trips', price: '₹11/km', dayRent: '₹3,300', features: ['AC', 'Music System', 'Luggage', 'Charger'] },
  { id: 'c2', category: 'Cars', name: 'Dzire / Etios Sedan', seater: '4+1 Seater', seats: 4, type: 'Sedan • AC', ideal: 'Daily commute & airport', price: '₹12/km', dayRent: '₹3,600', features: ['AC', 'Pushback', 'Luggage', 'Music'] },
  { id: 'c3', category: 'Cars', name: 'Honda City Premium', seater: '4+1 Seater', seats: 4, type: 'Premium Sedan • AC', ideal: 'Business travel', price: '₹14/km', dayRent: '₹4,200', features: ['AC', 'Leather Seats', 'Music', 'Charger'] },
  { id: 'c4', category: 'Cars', name: 'Ertiga 6+1 MUV', seater: '6+1 Seater', seats: 6, type: 'MUV • AC', ideal: 'Small family & outstation', price: '₹16/km', dayRent: '₹4,800', features: ['AC', 'Pushback', 'Luggage', 'Music'] },
  { id: 'c5', category: 'Cars', name: 'Innova Crysta', seater: '6/7/8 Seater', seats: 7, type: 'MUV • AC', ideal: 'Most booked for Maharashtra', price: '₹18/km', dayRent: '₹5,400', features: ['AC', 'Pushback', 'Luggage', 'Charger', 'Music'], popular: true },
  { id: 'c6', category: 'Cars', name: 'Innova Hycross Hybrid', seater: '7 Seater', seats: 7, type: 'Hybrid • AC', ideal: 'Premium comfort', price: '₹22/km', dayRent: '₹6,600', features: ['AC', 'Panoramic', 'Charger', 'Music', 'Luggage'] },
  { id: 'c7', category: 'Cars', name: 'Kia Carens / XL6', seater: '6+1 Seater', seats: 6, type: 'MUV • AC', ideal: 'Family tours', price: '₹17/km', dayRent: '₹5,100', features: ['AC', 'Pushback', 'Luggage', 'Charger'] },
  { id: 'c8', category: 'Cars', name: 'Fortuner / Scorpio-N', seater: '7 Seater', seats: 7, type: 'SUV • AC', ideal: 'VIP & rough terrain', price: '₹35/km', dayRent: '₹10,500', features: ['AC', '4x4', 'Leather', 'Music', 'Luggage'] },
  { id: 't1', category: 'Tempo Traveller', name: '12 Seater Tempo Traveller', seater: '12+1 Seater', seats: 12, type: 'Tempo Traveller • AC', ideal: 'Family & friends', price: '₹20/km', dayRent: '₹6,000', features: ['AC', 'Pushback', 'Music', 'Charger'] },
  { id: 't2', category: 'Tempo Traveller', name: '13 Seater Maharaja', seater: '13 Seater', seats: 13, type: 'Luxury TT • AC', ideal: 'Luxury interior', price: '₹22/km', dayRent: '₹6,600', features: ['AC', 'Maharaja Seats', 'LED', 'Music'], popular: true },
  { id: 't3', category: 'Tempo Traveller', name: '17 Seater Tempo Traveller', seater: '17 Seater', seats: 17, type: 'Tempo Traveller • AC', ideal: 'Group travel', price: '₹24/km', dayRent: '₹7,200', features: ['AC', 'Pushback', 'Luggage', 'Music'] },
  { id: 't4', category: 'Tempo Traveller', name: '20 Seater Tempo Traveller', seater: '20 Seater', seats: 20, type: 'Tempo Traveller • AC', ideal: 'Corporate & picnic', price: '₹28/km', dayRent: '₹8,400', features: ['AC', 'Pushback', 'Music', 'Luggage'] },
  { id: 't5', category: 'Tempo Traveller', name: '26 Seater Tempo Traveller', seater: '26 Seater', seats: 26, type: 'Tempo Traveller • AC', ideal: 'Large group', price: '₹32/km', dayRent: '₹9,600', features: ['AC', '2x2 Pushback', 'Music', 'Charger'] },
  { id: 't6', category: 'Tempo Traveller', name: 'Force Urbania 17 Luxury', seater: '17 Seater', seats: 17, type: 'Luxury Van • AC', ideal: 'Premium corporate', price: '₹45/km', dayRent: '₹13,500', features: ['AC', 'Aircraft Seats', 'LED', 'Charger', 'Premium'], popular: true },
  { id: 't7', category: 'Tempo Traveller', name: 'Force Urbania 26 Luxury', seater: '26 Seater', seats: 26, type: 'Luxury Coach • AC', ideal: 'VIP group travel', price: '₹55/km', dayRent: '₹16,500', features: ['AC', 'Recliner', 'Premium', 'Music', 'Luggage'] },
  { id: 'b1', category: 'Buses', name: '21 Seater Mini Bus', seater: '21 Seater', seats: 21, type: 'Mini Bus • AC', ideal: 'City & short tours', price: '₹35/km', dayRent: '₹10,500', features: ['AC', 'Pushback', 'Music', 'Luggage'] },
  { id: 'b2', category: 'Buses', name: '27 Seater Mini Bus', seater: '27 Seater', seats: 27, type: 'Mini Bus • AC', ideal: 'School & office trips', price: '₹42/km', dayRent: '₹12,600', features: ['AC', '2x2 Seats', 'Music', 'Charger'] },
  { id: 'b3', category: 'Buses', name: '32 Seater Bus 2x2', seater: '32 Seater', seats: 32, type: 'Coach • AC', ideal: 'Outstation groups', price: '₹50/km', dayRent: '₹15,000', features: ['AC', 'Pushback', 'Luggage', 'Music'] },
  { id: 'b4', category: 'Buses', name: '35 Seater Bus Pushback', seater: '35 Seater', seats: 35, type: 'Coach • AC', ideal: 'Long distance', price: '₹55/km', dayRent: '₹16,500', features: ['AC', 'Pushback', 'LED TV', 'Music'] },
  { id: 'b5', category: 'Buses', name: '40 Seater Luxury Bus', seater: '40 Seater', seats: 40, type: 'Luxury • AC', ideal: 'Corporate & wedding', price: '₹65/km', dayRent: '₹19,500', features: ['AC', 'Pushback', 'Music', 'Charger'], popular: true },
  { id: 'b6', category: 'Buses', name: '45 Seater BharatBenz / Volvo', seater: '45 Seater', seats: 45, type: 'Premium Coach • AC', ideal: 'Intercity tours', price: '₹75/km', dayRent: '₹22,500', features: ['AC', 'Air Suspension', 'Pushback', 'LED'] },
  { id: 'b7', category: 'Buses', name: '49 Seater Luxury Coach', seater: '49 Seater', seats: 49, type: 'Luxury Coach • AC', ideal: 'Long tours', price: '₹85/km', dayRent: '₹25,500', features: ['AC', '2x2 Pushback', 'Charger', 'Music', 'Premium'] },
  { id: 'b8', category: 'Buses', name: '40 Seater AC Sleeper Bus', seater: '40 Sleeper', seats: 40, type: 'Sleeper • AC', ideal: 'Overnight outstation', price: '₹80/km', dayRent: '₹24,000', features: ['AC', 'Sleeper Berths', 'Charger', 'Curtains'] },
  { id: 'l1', category: 'Luxury', name: 'Fortuner Legender', seater: '7 Seater', seats: 7, type: 'SUV • Luxury', ideal: 'Groom entry & VIP', price: '₹45/km', dayRent: '₹15,000', features: ['AC', 'Leather', 'Sunroof', 'Premium'], popular: true },
  { id: 'l2', category: 'Luxury', name: 'Mercedes E-Class / C-Class', seater: '4+1 Seater', seats: 4, type: 'Sedan • Luxury', ideal: 'Wedding & corporate', price: '₹65/km', dayRent: '₹18,000', features: ['AC', 'Leather', 'Premium Sound', 'Chauffeur'] },
  { id: 'l3', category: 'Luxury', name: 'BMW 5 Series', seater: '4+1 Seater', seats: 4, type: 'Sedan • Luxury', ideal: 'VIP airport & events', price: '₹70/km', dayRent: '₹20,000', features: ['AC', 'Premium', 'Charger', 'Luxury'] },
  { id: 'l4', category: 'Luxury', name: 'Audi A4 / A6', seater: '4+1 Seater', seats: 4, type: 'Sedan • Luxury', ideal: 'Wedding & CEO travel', price: '₹65/km', dayRent: '₹18,000', features: ['AC', 'Quattro', 'Premium', 'Music'] },
  { id: 'l5', category: 'Luxury', name: 'Jaguar XF', seater: '4+1 Seater', seats: 4, type: 'Sedan • Luxury', ideal: 'Premium wedding', price: '₹75/km', dayRent: '₹22,000', features: ['AC', 'Leather', 'Panoramic', 'Premium'] },
  { id: 'l6', category: 'Luxury', name: 'Vintage Car - Ambassador', seater: '4 Seater', seats: 4, type: 'Vintage • Decorated', ideal: 'Wedding entry', price: 'On Request', dayRent: '₹25,000', features: ['Decorated', 'Classic', 'Photo Friendly'] },
];

export const RATE_CHART = [
  ['Swift / Baleno', '4+1', '₹3,300', '₹11/km', '₹400'],
  ['Dzire Sedan', '4+1', '₹3,600', '₹12/km', '₹400'],
  ['Ertiga', '6+1', '₹4,800', '₹16/km', '₹500'],
  ['Innova Crysta', '7', '₹5,400', '₹18/km', '₹500'],
  ['Innova Hycross', '7', '₹6,600', '₹22/km', '₹600'],
  ['12 Seater TT', '12', '₹6,000', '₹20/km', '₹600'],
  ['17 Seater TT', '17', '₹7,200', '₹24/km', '₹600'],
  ['26 Seater TT', '26', '₹9,600', '₹32/km', '₹700'],
  ['Force Urbania 17', '17', '₹13,500', '₹45/km', '₹800'],
  ['27 Seater Mini Bus', '27', '₹12,600', '₹42/km', '₹700'],
  ['40 Seater Luxury Bus', '40', '₹19,500', '₹65/km', '₹800'],
  ['49 Seater Coach', '49', '₹25,500', '₹85/km', '₹1,000'],
];

export const TRANSPORT_SERVICES = [
  { title: 'Airport Transfer (BOM)', body: 'Fixed price from Airport T1/T2 to Badlapur, Thane, Kalyan, Navi Mumbai and Pune. Live flight tracking with 60 minutes free waiting.', tags: ['T1/T2', 'Fixed price', 'Flight tracking'] },
  { title: 'Outstation & Holidays', body: 'Mumbai to Pune, Lonavala, Mahabaleshwar, Shirdi, Nashik, Goa, Ashtavinayak and Jyotirlinga circuits.', tags: ['Pune', 'Lonavala', 'Shirdi', 'Goa'] },
  { title: 'Corporate Monthly Rentals', body: 'Employee transport, monthly contracts and client visits for BKC, Kurla Phoenix and Airoli hubs with GST invoicing.', tags: ['BKC', 'Airoli', 'GST invoice'] },
  { title: 'Wedding & Events', body: 'Decorated Fortuner Legender for the groom, Mercedes or BMW for family, and 21 to 49-seater coaches for guest shuttles.', tags: ['Groom entry', 'Guest shuttle'] },
  { title: 'School, College & Industrial Visits', body: 'Sanitised buses with experienced drivers for picnics, college tours and factory visits. Live driver location shared on request.', tags: ['Picnics', 'Factory visits'] },
  { title: 'Pilgrimage & Group Tours', body: 'Ashtavinayak, 12 Jyotirlinga, Shirdi with Shani Shingnapur, and temple circuits by Tempo Traveller and luxury bus.', tags: ['Ashtavinayak', 'Jyotirlinga'] },
];

export const TRANSPORT_FAQ = [
  { q: 'Is toll & parking included in the quotes?', a: 'Toll and parking are charged at actuals as per Fastag and parking receipts. For fixed-price airport packages, toll is included up to Badlapur/Thane.' },
  { q: 'What are driver allowance / bata charges?', a: 'Driver bata ranges from ₹400 to ₹1,000 per day depending on the vehicle class. For outstation overnight trips, driver accommodation is managed by us or billed at standard rates.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 24 hours before scheduled pickup. For luxury and wedding fleets, reservations require a 30% deposit.' },
  { q: 'Are AC and Non-AC rates different?', a: 'Yes. AC is standard across all categories. Non-AC rates save ₹2 to ₹5 per km for long group journeys.' },
  { q: 'What payment methods are supported?', a: 'City rides can be settled after the trip by UPI or cash. Outstation tours and bus bookings need a 20% advance. Corporate accounts get 15 days credit with GST billing.' },
  { q: 'Can wedding cars be decorated before arrival?', a: 'Yes. Floral decoration is available for the Fortuner Legender, Mercedes and Vintage Ambassador with 7 days notice.' },
];

export function suggestVehicles(pax) {
  if (pax <= 4) return FLEET.filter((v) => ['Cars', 'Luxury'].includes(v.category) && v.seats >= pax && v.seats <= 7).slice(0, 3);
  if (pax <= 8) return FLEET.filter((v) => v.seats >= pax && v.seats <= 13).slice(0, 3);
  if (pax <= 20) return FLEET.filter((v) => v.category === 'Tempo Traveller' && v.seats >= pax).slice(0, 3);
  if (pax <= 35) return FLEET.filter((v) => v.category === 'Buses' && v.seats >= pax && v.seats <= 35).slice(0, 3);
  return FLEET.filter((v) => v.seats >= pax).slice(0, 3);
}
