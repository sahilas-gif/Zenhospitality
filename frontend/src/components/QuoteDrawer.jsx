import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Loader2, MessageCircle, Minus, Phone, Plus, X } from 'lucide-react';
import api from '../lib/api';
import { CONTACT } from '../data/contact';
import { buildMessage, openWhatsAppWindow, whatsappUrl } from '../lib/whatsapp';
import { setScrollLocked } from '../lib/scroll';

const today = () => new Date().toISOString().slice(0, 10);

function Stepper({ label, value, onChange, min = 0, max = 50 }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gold/15 px-4 py-3">
      <span className="text-sm text-pearl/80">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-gold/25 text-pearl disabled:opacity-30">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-gold/25 text-pearl disabled:opacity-30">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

const field = 'w-full rounded-2xl border border-gold/15 bg-ink-950/60 px-4 py-3 text-sm text-pearl placeholder:text-pearl/35 focus:border-gold/60 focus:outline-none [color-scheme:dark]';

/**
 * context: {
 *   type: 'hotel' | 'package' | 'transport' | 'itinerary' | 'general',
 *   title, subtitle,
 *   hotel?: { id, name, city, room_types },
 *   packageId?, itineraryId?, itinerarySummary?,
 *   stay?: boolean   // show check-in/check-out + rooms
 *   extra?: [[label, value]]  // added to the WhatsApp message and the saved note
 * }
 */
export default function QuoteDrawer({ open, onClose, context = {}, onQuoted }) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const panel = useRef(null);
  const lastFocus = useRef(null);
  const isStay = context.stay ?? context.type === 'hotel';
  const roomTypes = context.hotel?.room_types?.map((r) => r.name).filter(Boolean) ?? [];

  const [form, setForm] = useState({ name: '', phone: '', email: '', checkIn: '', checkOut: '', date: '', room: '', message: '', website: '' });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | sending | saved | unsaved
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [waText, setWaText] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    setScrollLocked(true);
    setStatus('idle');
    setError('');
    setReference('');
    setForm((f) => ({ ...f, room: context.room || '' }));
    const t = setTimeout(() => panel.current?.querySelector('input,select,textarea,button')?.focus(), 50);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const els = panel.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea');
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      setScrollLocked(false);
      lastFocus.current?.focus?.();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (form.name.trim().length < 2) return 'Please enter your name.';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number.';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(form.email)) return 'Please check the email address.';
    if (isStay && form.checkIn && form.checkOut && form.checkOut <= form.checkIn) return 'Check-out must be after check-in.';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setStatus('sending');
    const wa = openWhatsAppWindow();

    const lines = [
      ['Name', form.name.trim()],
      ['Phone', form.phone.trim()],
      ['Email', form.email.trim()],
      ...(context.hotel ? [['Hotel', `${context.hotel.name}, ${context.hotel.city}`]] : []),
      ['Room', form.room],
      ...(isStay
        ? [['Check-in', form.checkIn], ['Check-out', form.checkOut], ['Rooms', rooms]]
        : [['Travel date', form.date]]),
      ['Adults', adults],
      ['Children', children || ''],
      ...(context.extra || []),
      ['Note', form.message.trim()],
    ];

    let ref = '';
    try {
      const { data } = await api.post('/enquiries', {
        enquiry_type: context.type || 'general',
        hotel_id: context.hotel?.id ?? null,
        package_id: context.packageId ?? null,
        itinerary_id: context.itineraryId ?? null,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || null,
        room_type: form.room || null,
        check_in: isStay && form.checkIn ? form.checkIn : null,
        check_out: isStay && form.checkOut ? form.checkOut : null,
        travel_date: isStay ? form.checkIn || null : form.date || null,
        adults,
        children,
        rooms: isStay ? rooms : null,
        group_size: adults + children,
        message: [context.title, ...(context.extra || []).map(([k, v]) => `${k}: ${v}`), form.message.trim()].filter(Boolean).join('\n'),
        source_page: window.location.pathname,
        website: form.website,
      });
      ref = data.reference;
    } catch {
      ref = '';
    }

    const text = buildMessage(`Hi Zen World Hospitality, I'd like a quote: ${context.title || 'Enquiry'}`, lines, ref);
    setWaText(text);
    wa.go(text);
    setReference(ref);
    setStatus(ref ? 'saved' : 'unsaved');
    if (onQuoted) onQuoted();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex justify-end" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-gold/15 bg-ink-950"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gold/10 p-6">
              <div>
                <p className="eyebrow mb-2">{context.type === 'hotel' ? 'Best rates via Zen' : 'Free quote'}</p>
                <h2 id={titleId} className="font-display text-3xl leading-tight text-pearl">{context.title || 'Get a quote'}</h2>
                {context.subtitle && <p className="mt-1 text-sm text-pearl/55">{context.subtitle}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/20 text-pearl/80 hover:text-pearl">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-6" data-lenis-prevent>
              {status === 'saved' || status === 'unsaved' ? (
                <div className="space-y-5" aria-live="polite">
                  {status === 'saved' ? (
                    <div className="rounded-2xl border border-gold/25 bg-gold/5 p-5">
                      <CheckCircle2 className="h-7 w-7 text-gold" />
                      <p className="mt-3 font-display text-2xl text-pearl">Request saved</p>
                      <p className="mt-1 text-sm text-pearl/65">
                        Your reference is <strong className="text-gold">{reference}</strong>. Send the WhatsApp message so a planner can reply straight away.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5">
                      <AlertTriangle className="h-7 w-7 text-amber-300" />
                      <p className="mt-3 font-display text-2xl text-pearl">Not saved online</p>
                      <p className="mt-1 text-sm text-pearl/65">
                        We couldn't save this on our site, but your details are in the WhatsApp message. Please send it, or call us, so we receive your request.
                      </p>
                    </div>
                  )}
                  <a href={whatsappUrl(waText)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-semibold text-ink-950">
                    <MessageCircle className="h-4 w-4" /> Open WhatsApp again
                  </a>
                  <a href={CONTACT.phonePrimaryTel} className="flex items-center justify-center gap-2 rounded-full border border-gold/25 py-3.5 text-pearl">
                    <Phone className="h-4 w-4" /> Call {CONTACT.phonePrimary}
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-4">
                  {roomTypes.length > 0 && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs text-pearl/60">Room type</span>
                      <select value={form.room} onChange={set('room')} className={field}>
                        <option value="">Any room</option>
                        {roomTypes.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </label>
                  )}
                  {isStay ? (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-1.5 block text-xs text-pearl/60">Check-in</span>
                        <input type="date" min={today()} value={form.checkIn} onChange={set('checkIn')} className={field} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs text-pearl/60">Check-out</span>
                        <input type="date" min={form.checkIn || today()} value={form.checkOut} onChange={set('checkOut')} className={field} />
                      </label>
                    </div>
                  ) : (
                    <label className="block">
                      <span className="mb-1.5 block text-xs text-pearl/60">Travel date (optional)</span>
                      <input type="date" min={today()} value={form.date} onChange={set('date')} className={field} />
                    </label>
                  )}
                  <Stepper label="Adults" value={adults} onChange={setAdults} min={1} />
                  <Stepper label="Children" value={children} onChange={setChildren} />
                  {isStay && <Stepper label="Rooms" value={rooms} onChange={setRooms} min={1} max={30} />}

                  <label className="block">
                    <span className="mb-1.5 block text-xs text-pearl/60">Full name</span>
                    <input required autoComplete="name" value={form.name} onChange={set('name')} className={field} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-pearl/60">Phone or WhatsApp</span>
                    <input required type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} className={field} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-pearl/60">Email (optional)</span>
                    <input type="email" autoComplete="email" value={form.email} onChange={set('email')} className={field} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-pearl/60">Anything else? (optional)</span>
                    <textarea rows={3} maxLength={2000} value={form.message} onChange={set('message')} className={field} />
                  </label>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                  {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}

                  <button type="submit" disabled={status === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-semibold text-ink-950 transition-colors hover:bg-[#e2c35c] disabled:opacity-60">
                    {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><MessageCircle className="h-4 w-4" /> Send and open WhatsApp</>}
                  </button>
                  <p className="text-center text-xs text-pearl/45">No payment now. A Zen planner confirms availability and the rate with you.</p>
                </form>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
