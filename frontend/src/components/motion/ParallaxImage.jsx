import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Picture from '../ui/Picture';

export default function ParallaxImage({ src, alt, className = '', amount = 60, priority = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, top: -amount, bottom: -amount }} className="absolute inset-x-0 will-change-transform">
        <Picture src={src} alt={alt} priority={priority} className="block h-full w-full" imgClassName="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
}
