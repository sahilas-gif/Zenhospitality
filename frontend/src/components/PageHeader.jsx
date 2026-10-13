const PageHeader = ({ title, subtitle }) => (
  <div className="relative overflow-hidden bg-ink-950 pb-16 pt-36 md:pb-24 md:pt-44">
    <div className="glow-gold pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[46rem] -translate-x-1/2" />
    <div className="relative z-10 mx-auto max-w-7xl px-5 text-center md:px-8">
      <h1 className="mb-4 font-display text-4xl text-pearl md:mb-6 md:text-6xl">{title}</h1>
      {subtitle && <p className="mx-auto max-w-2xl text-base text-pearl/70 md:text-xl">{subtitle}</p>}
    </div>
  </div>
);

export default PageHeader;
