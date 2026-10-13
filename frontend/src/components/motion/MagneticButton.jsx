import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';

const VARIANTS = {
  gold: 'bg-gold text-ink-950 hover:bg-[#e2c35c]',
  ghost: 'hairline text-pearl hover:bg-white/5',
  whatsapp: 'bg-[#25D366] text-ink-950 hover:bg-[#3fe07b]',
};

// Pulls gently toward the cursor on fine pointers; plain button everywhere else.
export default function MagneticButton({ to, href, children, variant = 'gold', className = '', strength = 0.28, ...rest }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${VARIANTS[variant]} ${className}`;
  const inner = <motion.span style={{ x, y }} className="inline-flex items-center gap-2">{children}</motion.span>;
  const common = { onPointerMove: onMove, onPointerLeave: reset, className: cls, ...rest };

  if (to) return <Link to={to} {...common}>{inner}</Link>;
  if (href) return <a href={href} {...common}>{inner}</a>;
  return <button type="button" {...common}>{inner}</button>;
}
