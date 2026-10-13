import TextReveal from '../motion/TextReveal';

export default function SectionHeading({ eyebrow, title, children, align = 'left', as = 'h2' }) {
  const center = align === 'center';
  return (
    <div className={`mb-10 md:mb-14 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <TextReveal as={as} className="text-4xl leading-[1.05] text-pearl md:text-6xl">
        {title}
      </TextReveal>
      {children && <p className="mt-5 text-base leading-relaxed text-pearl/65 md:text-lg">{children}</p>}
    </div>
  );
}
