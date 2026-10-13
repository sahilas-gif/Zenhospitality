import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { CONTACT } from '../data/contact';
import { setScrollLocked } from '../lib/scroll';

const serviceLinks = [
  { name: 'All services', href: '/services' },
  { name: 'Corporate travel', href: '/services/corporate' },
  { name: 'MICE and events', href: '/services/mice' },
  { name: 'Holidays and B2C', href: '/services/retail' },
  { name: 'Hotel management', href: '/services/hotel-management' },
  { name: 'Flight ticketing', href: '/flight-ticketing' },
];

const tourLinks = [
  { name: 'All domestic tours', href: '/domestic-tours' },
  { name: 'Kerala', href: '/domestic-tours/kerala' },
  { name: 'Goa', href: '/domestic-tours/goa' },
  { name: 'Gujarat', href: '/domestic-tours/gujarat' },
  { name: 'Mumbai', href: '/domestic-tours/mumbai' },
  { name: 'Uttar Pradesh', href: '/domestic-tours/up' },
  { name: 'Maharashtra', href: '/domestic-tours/maharashtra' },
  { name: 'Chardham Yatra', href: '/domestic-tours/chardham' },
  { name: 'International tours', href: '/international-tours' },
];

const primary = [
  { name: 'Hotels', href: '/hotels' },
  { name: 'Tours', menu: tourLinks, match: '/domestic-tours' },
  { name: 'Transport', href: '/transportation' },
  { name: 'Services', menu: serviceLinks, match: '/services' },
  { name: 'Plan a trip', href: '/plan-trip' },
  { name: 'About', href: '/about' },
];

function Dropdown({ item, open, onToggle, onClose, active }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && onClose();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] transition-colors ${active ? 'text-gold' : 'text-pearl/75 hover:text-pearl'}`}
      >
        {item.name}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="glass-nav absolute left-1/2 top-full mt-3 w-60 -translate-x-1/2 rounded-2xl p-2 shadow-2xl"
          >
            {item.menu.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                end
                className={({ isActive }) =>
                  `block rounded-xl px-3.5 py-2.5 text-sm transition-colors ${isActive ? 'bg-gold/10 text-gold' : 'text-pearl/80 hover:bg-white/5 hover:text-pearl'}`
                }
              >
                {l.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    setScrollLocked(mobileOpen);
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      setScrollLocked(false);
    };
  }, [mobileOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-5">
      <nav
        aria-label="Main"
        className={`pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-full py-2 pl-3 pr-2 transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled || mobileOpen ? 'glass-nav shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]' : 'border border-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 pl-1" aria-label="Zen World Hospitality home">
          <img src="/logo/zw-logo.jpg" alt="" width="36" height="36" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-lg tracking-wide text-pearl">Zen World</span>
        </Link>

        <div className="hidden items-center lg:flex">
          {primary.map((item) =>
            item.menu ? (
              <Dropdown
                key={item.name}
                item={item}
                open={menu === item.name}
                active={pathname.startsWith(item.match)}
                onToggle={() => setMenu((m) => (m === item.name ? null : item.name))}
                onClose={() => setMenu(null)}
              />
            ) : (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-[13px] transition-colors ${isActive ? 'text-gold' : 'text-pearl/75 hover:text-pearl'}`
                }
              >
                {item.name}
              </NavLink>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/contact" className="hidden rounded-full px-4 py-2 text-[13px] text-pearl/75 transition-colors hover:text-pearl md:inline-flex">
            Contact
          </Link>
          <a
            href={CONTACT.phonePrimaryTel}
            className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-[#e2c35c] sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" /> {CONTACT.phonePrimary}
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full text-pearl lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-nav pointer-events-auto absolute inset-x-3 top-[4.75rem] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl p-5 lg:hidden"
          >
            {[{ title: null, links: [{ name: 'Home', href: '/' }, ...primary.filter((p) => p.href), { name: 'Contact', href: '/contact' }] },
              { title: 'Tours', links: tourLinks },
              { title: 'Services', links: serviceLinks }].map((group) => (
              <div key={group.title ?? 'main'} className="border-b border-gold/10 py-3 last:border-0">
                {group.title && <p className="eyebrow mb-2 px-2">{group.title}</p>}
                <div className={group.title ? 'grid grid-cols-2 gap-1' : 'grid gap-1'}>
                  {group.links.map((l) => (
                    <NavLink
                      key={l.href}
                      to={l.href}
                      end
                      className={({ isActive }) =>
                        `rounded-xl px-2 py-2.5 ${group.title ? 'text-sm' : 'font-display text-2xl'} ${isActive ? 'text-gold' : 'text-pearl/85'}`
                      }
                    >
                      {l.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
            <a href={CONTACT.phonePrimaryTel} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-semibold text-ink-950">
              <Phone className="h-4 w-4" /> {CONTACT.phonePrimary}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
