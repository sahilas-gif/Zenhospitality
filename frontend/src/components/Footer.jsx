import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="px-6 py-16 border-t border-white/[0.05] bg-[#0a0f1c]">
    <div className="max-w-7xl mx-auto flex flex-col items-center">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-white font-bold text-xs tracking-tighter">ZW</span>
        </div>
        <span className="font-playfair font-bold text-xl tracking-tight uppercase text-white">ZEN WORLD</span>
      </div>
      <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-gray-400 text-sm font-medium mb-12">
        <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
        <Link to="/services" className="hover:text-emerald-400 transition-colors">Our Services</Link>
        <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
        <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
      </nav>
      <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
      <p className="text-gray-600 text-[11px] tracking-widest uppercase">
        &copy; {new Date().getFullYear()} Zen World Hospitality. Crafted for Excellence.
      </p>
    </div>
  </footer>
);

export default Footer;
