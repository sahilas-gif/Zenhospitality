import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import MagneticButton from './motion/MagneticButton';
import TextReveal from './motion/TextReveal';
import { whatsappUrl } from '../lib/whatsapp';

const isSafeVideo = (url) => typeof url === 'string' && /^(https:\/\/|\/)[^\s"'<>]+\.(mp4|webm)(\?.*)?$/i.test(url);

const Hero = ({ title, subtitle, description, videoUrl }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  useEffect(() => {
    setSaveData(Boolean(navigator.connection?.saveData));
  }, []);

  const showVideo = isSafeVideo(videoUrl) && !reduce && !saveData;

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 md:items-center md:pb-0">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <picture className="block h-full w-full">
          <source media="(max-width: 900px)" srcSet="/images/hero/resort-sunset-900.avif" type="image/avif" />
          <source media="(max-width: 900px)" srcSet="/images/hero/resort-sunset-900.webp" type="image/webp" />
          <source srcSet="/images/hero/resort-sunset.avif" type="image/avif" />
          <source srcSet="/images/hero/resort-sunset.webp" type="image/webp" />
          <img src="/images/hero/resort-sunset.jpg" alt="" fetchPriority="high" className="h-full w-full scale-105 object-cover" />
        </picture>
        {showVideo && (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/35 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-950/20 to-transparent" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold" /> {subtitle || 'Zen World Hospitality, Mumbai'}
          </motion.p>
          <TextReveal as="h1" delay={0.15} className="text-[2.9rem] leading-[0.98] text-pearl sm:text-6xl md:text-7xl lg:text-[5.6rem]">
            {title || 'Hotels, tours and events, arranged from Mumbai.'}
          </TextReveal>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-pearl/75 md:text-lg"
          >
            {description || 'Partner hotels at rates we negotiate, tours across India, outstation cabs and corporate travel. One team, on WhatsApp.'}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-col flex-wrap gap-3 sm:flex-row"
          >
            <MagneticButton to="/hotels">
              Explore hotels <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton variant="ghost" to="/plan-trip">
              <Sparkles className="h-4 w-4" /> AI trip planner
            </MagneticButton>
            <MagneticButton variant="ghost" href={whatsappUrl('Hi Zen World Hospitality, I would like help planning a trip.')} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp a planner
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-xs tracking-[0.3em] text-pearl/50 md:flex">
        SCROLL <ArrowDown className="h-4 w-4 text-gold" />
      </div>
    </section>
  );
};

export default Hero;
