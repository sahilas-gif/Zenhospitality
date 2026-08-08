const PageHeader = ({ title, subtitle }) => (
  <div className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden bg-[#0a0f1c]">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-[#0a0f1c] to-[#0a0f1c]" />
      <div className="absolute top-0 right-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen translate-x-1/3 -translate-y-1/2 pointer-events-none" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-playfair text-white mb-4 md:mb-6 animate-fade-in">{title}</h1>
      {subtitle && <p className="text-base md:text-xl text-emerald-100/80 max-w-2xl mx-auto animate-fade-in">{subtitle}</p>}
    </div>
  </div>
);

export default PageHeader;
