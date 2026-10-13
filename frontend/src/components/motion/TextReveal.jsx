import { motion, useReducedMotion } from 'motion/react';

// Word-by-word rise for headings. Non-string children render as-is.
export default function TextReveal({ children, as = 'h2', className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.h2;
  if (typeof children !== 'string' || reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const words = children.split(' ');
  return (
    <Tag className={className} aria-label={children} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden px-[0.08em] pb-[0.12em] -mx-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '105%', opacity: 0 }, show: { y: '0%', opacity: 1 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.05 }}
          >
            {w}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
