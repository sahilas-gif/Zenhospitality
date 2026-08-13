import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { CONTACT } from '../data/contact';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

const serviceLinks = [
  { name: 'Overview', href: '/services' },
  { name: 'Corporate Travel', href: '/services/corporate' },
  { name: 'MICE Accommodations', href: '/services/mice' },
  { name: 'Retail & B2C Booking', href: '/services/retail' },
  { name: 'Hotel Management', href: '/services/hotel-management' },
];

const tourLinks = [
  { name: 'All Domestic Tours', href: '/domestic-tours' },
  { name: 'Kerala Tours', href: '/domestic-tours/kerala' },
  { name: 'Goa Tours', href: '/domestic-tours/goa' },
  { name: 'Gujarat Tours', href: '/domestic-tours/gujarat' },
  { name: 'Mumbai Tours', href: '/domestic-tours/mumbai' },
  { name: 'Uttar Pradesh Tours', href: '/domestic-tours/up' },
  { name: 'Maharashtra Tours', href: '/domestic-tours/maharashtra' },
  { name: 'Chardham Yatra', href: '/domestic-tours/chardham' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const servicesRef = useRef(null);
  const toursRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setToursOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
      if (toursRef.current && !toursRef.current.contains(e.target)) setToursOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isServicesActive = location.pathname.startsWith('/services');
  const isToursActive = location.pathname.startsWith('/domestic-tours');

  const linkClass = (path) =>
    `text-sm hover:text-emerald-400 transition-colors uppercase tracking-wider ${
      isActive(path) ? 'text-emerald-500' : 'text-gray-300'
    }`;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-4 md:py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo/zw-logo.jpg"
              alt="Zen World Hospitality"
              className="h-10 md:h-12 w-auto object-contain rounded-lg shadow-lg"
            />
            <span className="font-playfair font-bold text-xl md:text-2xl tracking-tight uppercase">ZEN WORLD</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/about" className={linkClass('/about')}>About Us</Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button onClick={() => { setServicesOpen((o) => !o); setToursOpen(false); }} className={`flex items-center text-sm hover:text-emerald-400 transition-colors uppercase tracking-wider ${isServicesActive ? 'text-emerald-500' : 'text-gray-300'}`}>
                Services <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 glass-nav border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="py-2">
                    {serviceLinks.map((link) => (
                      <Link key={link.name} to={link.href} className={`block px-4 py-3 text-sm hover:bg-gray-800/50 hover:text-emerald-400 transition-colors ${isActive(link.href) ? 'text-emerald-500 bg-gray-800/30' : 'text-gray-300'}`}>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tours Packages Dropdown */}
            <div className="relative" ref={toursRef}>
              <button onClick={() => { setToursOpen((o) => !o); setServicesOpen(false); }} className={`flex items-center text-sm hover:text-emerald-400 transition-colors uppercase tracking-wider ${isToursActive ? 'text-emerald-500' : 'text-gray-300'}`}>
                Tours Packages <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${toursOpen ? 'rotate-180' : ''}`} />
              </button>
              {toursOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 glass-nav border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="py-2">
                    {tourLinks.map((link) => (
                      <Link key={link.name} to={link.href} className={`block px-4 py-3 text-sm hover:bg-gray-800/50 hover:text-emerald-400 transition-colors ${isActive(link.href) ? 'text-emerald-500 bg-gray-800/30' : 'text-gray-300'}`}>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/contact" className={linkClass('/contact')}>Contact Us</Link>

            <a href={CONTACT.phonePrimaryTel} className="flex items-center text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full transition-all hover-glow shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <Phone className="w-4 h-4 mr-2" />Call Now
            </a>
          </div>

          <button onClick={() => setIsOpen((o) => !o)} className="md:hidden text-gray-300 hover:text-white focus:outline-none p-2">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="glass-nav border-t border-b border-gray-800 shadow-2xl">
          <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={`block px-3 py-2.5 text-base font-medium rounded-lg ${isActive(link.href) ? 'text-emerald-400 bg-gray-800' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'}`}>
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-800 my-2 pt-2">
              <span className="block px-3 py-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider">Services</span>
              {serviceLinks.map((link) => (
                <Link key={link.href} to={link.href} className={`block px-3 py-2.5 ml-2 text-sm font-medium rounded-lg ${isActive(link.href) ? 'text-emerald-400 bg-gray-800' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-800 my-2 pt-2">
              <span className="block px-3 py-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider">Tours Packages</span>
              {tourLinks.map((link) => (
                <Link key={link.href} to={link.href} className={`block px-3 py-2.5 ml-2 text-sm font-medium rounded-lg ${isActive(link.href) ? 'text-emerald-400 bg-gray-800' : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <a href={CONTACT.phonePrimaryTel} className="flex items-center justify-center w-full px-3 py-3 text-base font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors">
                <Phone className="w-4 h-4 mr-2" /> {CONTACT.phonePrimary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
