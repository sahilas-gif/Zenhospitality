import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Facebook, Instagram } from './ui/BrandIcons';
import { CONTACT } from '../data/contact';
import { whatsappUrl } from '../lib/whatsapp';

const columns = [
  {
    title: 'Stay and travel',
    links: [
      ['Partner hotels', '/hotels'],
      ['Domestic tours', '/domestic-tours'],
      ['International tours', '/international-tours'],
      ['Transportation', '/transportation'],
      ['Plan a trip', '/plan-trip'],
    ],
  },
  {
    title: 'For business',
    links: [
      ['Corporate travel', '/services/corporate'],
      ['MICE and events', '/services/mice'],
      ['Hotel management', '/services/hotel-management'],
      ['Flight ticketing', '/flight-ticketing'],
    ],
  },
  {
    title: 'Zen',
    links: [
      ['About us', '/about'],
      ['All services', '/services'],
      ['Contact', '/contact'],
      ['Privacy policy', '/privacy-policy'],
    ],
  },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-gold/10 bg-ink-950">
    <div className="glow-gold pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2" />
    <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 md:px-8">
      <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo/zw-logo.jpg" alt="" width="44" height="44" className="h-11 w-11 rounded-full object-cover" />
            <span className="font-display text-2xl text-pearl">Zen World Hospitality</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-pearl/55">
            Hotels, holidays, company travel and cars, booked from Mumbai.
          </p>
          <div className="mt-6 space-y-2.5 text-sm">
            <a href={CONTACT.phonePrimaryTel} className="flex items-center gap-3 text-pearl/80 hover:text-gold">
              <Phone className="h-4 w-4 text-gold" /> {CONTACT.phonePrimary}
            </a>
            <a href={whatsappUrl('Hi Zen World Hospitality')} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-pearl/80 hover:text-gold">
              <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp us
            </a>
            <a href={CONTACT.emailPrimaryMailto} className="flex items-center gap-3 text-pearl/80 hover:text-gold">
              <Mail className="h-4 w-4 text-gold" /> {CONTACT.emailPrimary}
            </a>
          </div>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="eyebrow mb-5">{col.title}</p>
            <ul className="space-y-3 text-sm">
              {col.links.map(([name, href]) => (
                <li key={href}>
                  <Link to={href} className="text-pearl/65 transition-colors hover:text-pearl">{name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-gold/10 pt-8 md:flex-row">
        <p className="text-xs tracking-wider text-pearl/40">&copy; {new Date().getFullYear()} Zen World Hospitality, Mumbai</p>
        <div className="flex gap-2">
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hairline grid h-10 w-10 place-items-center rounded-full text-pearl/70 transition-colors hover:bg-gold hover:text-ink-950">
            <Instagram className="h-4 w-4" />
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hairline grid h-10 w-10 place-items-center rounded-full text-pearl/70 transition-colors hover:bg-gold hover:text-ink-950">
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
