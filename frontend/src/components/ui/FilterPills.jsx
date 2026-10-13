import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';

export default function FilterPills({ options, value, onChange, label = 'Filter' }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div role="radiogroup" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {options.map((opt) => {
        const { value: v, label: l } = typeof opt === 'string' ? { value: opt, label: opt } : opt;
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              active ? 'text-ink-950' : 'hairline text-pearl/75 hover:text-pearl'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`pill-${id}`}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-gold"
              />
            )}
            <span className="relative">{l}</span>
          </button>
        );
      })}
    </div>
  );
}
