import useScrollReveal from '../hooks/useScrollReveal';

export default function ScrollReveal({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease-out, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
