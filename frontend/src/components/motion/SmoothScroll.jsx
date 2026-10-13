import Lenis from 'lenis';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis, scrollToTop, setLenis } from '../../lib/scroll';

// Lenis only on fine pointers without reduced motion; touch keeps native momentum scroll.
export default function SmoothScroll({ disabled = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (disabled || reduce || !fine) return undefined;
    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(instance);
    let raf = requestAnimationFrame(function loop(t) {
      getLenis()?.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [disabled]);

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}
