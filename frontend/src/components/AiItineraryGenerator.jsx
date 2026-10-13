import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AlertTriangle, ArrowUpRight, BedDouble, Download, Loader2, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import api from '../lib/api';
import QuoteDrawer from './QuoteDrawer';
import FilterPills from './ui/FilterPills';
import { downloadItineraryPdf } from '../lib/itineraryPdf';
import { whatsappUrl } from '../lib/whatsapp';

const BUDGETS = [
  { value: 'economy', label: 'Value' },
  { value: 'standard', label: 'Comfort' },
  { value: 'luxury', label: 'Luxury' },
];
const PACES = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'packed', label: 'Packed' },
];
const IDEAS = ['Lonavala', 'Goa', 'Kerala', 'Varanasi', 'Rajasthan'];

const field = 'w-full rounded-2xl border border-gold/15 bg-ink-950/60 px-4 py-3 text-sm text-pearl placeholder:text-pearl/35 focus:border-gold/60 focus:outline-none';

export default function AiItineraryGenerator() {
  const reduce = useReducedMotion();
  const results = useRef(null);
  const [form, setForm] = useState({ destination: '', duration_days: 3, budget: 'standard', pace: 'balanced', interests: '', travellers: 2, travel_month: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const generate = async (e) => {
    e.preventDefault();
    if (form.destination.trim().length < 2) {
      setError('Please tell us where you would like to go.');
      return;
    }
    setLoading(true);
    setError('');
    setPlan(null);
    try {
      const { data } = await api.post(
        '/ai/generate-itinerary',
        {
          destination: form.destination.trim(),
          duration_days: Math.min(21, Math.max(1, Number(form.duration_days) || 3)),
          budget: form.budget,
          pace: form.pace,
          interests: form.interests.trim(),
          travellers: Number(form.travellers) || null,
          travel_month: form.travel_month || null,
        },
        { timeout: 70000 },
      );
      setPlan({ id: data.id, ...data.itinerary_data });
      requestAnimationFrame(() => results.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
    } catch (err) {
      setError(
        err.response?.status === 503 || err.response?.status === 429
          ? err.response?.data?.detail || 'The planner is busy right now. Please try again in a minute.'
          : err.response?.status === 422
            ? 'Please check the trip details and try again.'
            : 'We could not reach the planner. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const pdf = async () => {
    setPdfBusy(true);
    try {
      await downloadItineraryPdf(plan);
    } finally {
      setPdfBusy(false);
    }
  };

  const hotels = plan ? [...new Map(plan.days.filter((d) => d.hotel).map((d) => [d.hotel.slug, d.hotel])).values()] : [];

  return (
    <section id="ai-trip-planner" className="relative">
      <form onSubmit={generate} className="rounded-[2rem] border border-gold/15 bg-ink-900/50 p-6 backdrop-blur md:p-10" aria-busy={loading}>
        <div className="grid gap-5 md:grid-cols-[2fr_1fr_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-xs text-pearl/60">Where to?</span>
            <input value={form.destination} onChange={set('destination')} maxLength={100} placeholder="Lonavala, Goa, Kerala..." className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-pearl/60">Days</span>
            <input type="number" min={1} max={21} value={form.duration_days} onChange={set('duration_days')} className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-pearl/60">Travellers</span>
            <input type="number" min={1} max={200} value={form.travellers} onChange={set('travellers')} className={field} />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {IDEAS.map((d) => (
            <button key={d} type="button" onClick={() => setForm((f) => ({ ...f, destination: d }))} className="rounded-full border border-gold/15 px-3 py-1.5 text-xs text-pearl/65 hover:border-gold/40 hover:text-pearl">
              {d}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <span className="mb-2 block text-xs text-pearl/60">Budget</span>
            <FilterPills label="Budget" options={BUDGETS} value={form.budget} onChange={(v) => setForm((f) => ({ ...f, budget: v }))} />
          </div>
          <div>
            <span className="mb-2 block text-xs text-pearl/60">Pace</span>
            <FilterPills label="Pace" options={PACES} value={form.pace} onChange={(v) => setForm((f) => ({ ...f, pace: v }))} />
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-[2fr_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-xs text-pearl/60">What do you enjoy? (optional)</span>
            <input value={form.interests} onChange={set('interests')} maxLength={300} placeholder="Temples, waterfalls, pure veg food, slow mornings" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-pearl/60">Month (optional)</span>
            <input type="month" value={form.travel_month} onChange={set('travel_month')} className={`${field} [color-scheme:dark]`} />
          </label>
        </div>
        {error && (
          <div role="alert" className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-pearl/80 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /> {error}</span>
            <a href={whatsappUrl(`Hi Zen, please plan ${form.duration_days} days in ${form.destination || 'India'} for ${form.travellers} people.`)} target="_blank" rel="noreferrer" className="shrink-0 font-semibold text-gold">
              Ask a planner on WhatsApp
            </a>
          </div>
        )}
        <button type="submit" disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-semibold text-ink-950 transition-colors hover:bg-[#e2c35c] disabled:opacity-60 md:w-auto md:px-10">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Planning your days (up to a minute)...</> : <><Sparkles className="h-4 w-4" /> Plan my trip</>}
        </button>
      </form>

      <div ref={results} className="scroll-mt-28">
        <AnimatePresence>
          {plan && (
            <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mt-14">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="eyebrow mb-3">Your draft plan</p>
                  <h2 className="font-display text-4xl text-pearl md:text-5xl">{plan.duration_days} days in {plan.destination}</h2>
                  {plan.summary && <p className="mt-3 max-w-2xl text-pearl/65">{plan.summary}</p>}
                  {plan.budget_summary && <p className="mt-2 text-sm text-pearl/50">{plan.budget_summary}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={pdf} disabled={pdfBusy} className="hairline inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-pearl hover:bg-white/5">
                    {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} PDF
                  </button>
                  <button type="button" onClick={() => setQuoteOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink-950">
                    <MessageCircle className="h-4 w-4" /> Get this quoted
                  </button>
                </div>
              </div>

              {hotels.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {hotels.map((h) => (
                    <Link key={h.slug} to={`/hotels/${h.slug}`} className="group inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-pearl">
                      <BedDouble className="h-4 w-4 text-gold" /> {h.name} <ArrowUpRight className="h-3.5 w-3.5 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}

              <ol className="mt-10 space-y-4">
                {plan.days.map((d) => (
                  <li key={d.day} className="grid gap-4 rounded-[1.5rem] border border-gold/10 bg-ink-900/40 p-6 md:grid-cols-[8rem_1fr] md:p-8">
                    <p className="font-display text-5xl leading-none text-gold/80">{String(d.day).padStart(2, '0')}</p>
                    <div>
                      <h3 className="font-display text-2xl text-pearl">{d.title}</h3>
                      <ul className="mt-4 space-y-3">
                        {d.activities.map((a, i) => (
                          <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm">
                            <span className="text-pearl/45">{a.time}</span>
                            <span><strong className="font-semibold text-pearl/90">{a.activity}</strong>{a.description ? <span className="block text-pearl/60">{a.description}</span> : null}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 flex flex-wrap items-center gap-2 border-t border-gold/10 pt-4 text-sm text-pearl/65">
                        <BedDouble className="h-4 w-4 text-gold" />
                        {d.hotel ? <Link to={`/hotels/${d.hotel.slug}`} className="text-gold underline-offset-4 hover:underline">{d.hotel.name}</Link> : d.accommodation_suggestion}
                        {d.estimated_cost && <span className="ml-auto text-pearl/45">{d.estimated_cost}</span>}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {plan.travel_tips?.length > 0 && (
                <div className="mt-8 rounded-[1.5rem] border border-gold/10 p-6 md:p-8">
                  <p className="eyebrow mb-4">Tips</p>
                  <ul className="grid gap-2 text-sm text-pearl/70 md:grid-cols-2">
                    {plan.travel_tips.map((t) => <li key={t}>· {t}</li>)}
                  </ul>
                </div>
              )}
              <p className="mt-6 flex items-center gap-2 text-xs text-pearl/40">
                <RotateCcw className="h-3.5 w-3.5" /> AI-generated draft. Timings and costs are estimates; a Zen planner confirms everything before you book.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {plan && (
        <QuoteDrawer
          open={quoteOpen}
          onClose={() => setQuoteOpen(false)}
          onQuoted={() => downloadItineraryPdf(plan)}
          context={{
            type: 'itinerary',
            itineraryId: plan.id,
            title: `${plan.duration_days} days in ${plan.destination}`,
            subtitle: 'AI draft, refined by a planner',
            stay: false,
            extra: [
              ['Plan', `${plan.duration_days} days in ${plan.destination}`],
              ['Budget', BUDGETS.find((b) => b.value === form.budget)?.label],
              ...(hotels.length ? [['Hotels', hotels.map((h) => h.name).join(', ')]] : []),
            ],
          }}
        />
      )}
    </section>
  );
}
