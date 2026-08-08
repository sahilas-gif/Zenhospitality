import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0f1c] via-[#0f172a] to-[#064e3b]">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/zen-hero/1920/1080')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1c]/50 to-[#0a0f1c]" />
    </div>

    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 md:pt-28">
      <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-semibold tracking-widest uppercase mb-5 md:mb-6 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        Welcome to Zen World Hospitality
      </span>

      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-playfair text-white mb-5 md:mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        Elevating <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#d4a854]">Experiences</span>.<br />
        Empowering Growth.
      </h1>

      <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        End-to-end hospitality, travel, and strategic hotel management solutions tailored for hotels, resorts, businesses, and global travelers.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <Link to="/services" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all transform hover:scale-105 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          Explore Services <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
        </Link>
        <Link to="/services/retail" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 glass-card hover:bg-white/10 text-white rounded-full font-medium transition-all text-center">
          View Packages
        </Link>
      </div>
    </div>

    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
      <div className="w-[26px] h-[42px] rounded-full border-2 border-white/30 flex justify-center p-2">
        <div className="w-1 h-3 bg-emerald-500 rounded-full" />
      </div>
    </div>
  </section>
);

export default Hero;
