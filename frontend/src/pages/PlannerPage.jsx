import AiItineraryGenerator from '../components/AiItineraryGenerator';
import TextReveal from '../components/motion/TextReveal';
import { useSeo } from '../lib/seo';

export default function PlannerPage() {
  useSeo('AI Trip Planner', 'Plan a day-by-day trip in a minute with the Zen AI planner, then have a Zen planner quote it with partner hotels and transport.');
  return (
    <div className="relative pb-28">
      <div className="glow-gold pointer-events-none absolute -top-20 right-0 h-[30rem] w-[40rem]" />
      <div className="relative mx-auto max-w-5xl px-5 pt-36 md:px-8 md:pt-44">
        <p className="eyebrow mb-5">AI trip planner</p>
        <TextReveal as="h1" className="text-5xl leading-[1] text-pearl md:text-7xl">Sketch the trip. We'll make it real.</TextReveal>
        <p className="mb-12 mt-6 max-w-xl text-pearl/65 md:text-lg">
          Get a day-by-day draft in under a minute. Where it fits, the planner suggests our partner hotels, and one tap sends it to a Zen planner for a quote.
        </p>
        <AiItineraryGenerator />
      </div>
    </div>
  );
}
