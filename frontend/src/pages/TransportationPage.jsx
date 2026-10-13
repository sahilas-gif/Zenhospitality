import { useState } from 'react';
import { MapPin, Navigation, Calendar, Users, Send, ChevronDown } from 'lucide-react';
import QuoteDrawer from '../components/QuoteDrawer';
import { FLEET, FLEET_CATEGORIES, RATE_CHART, TRANSPORT_SERVICES, TRANSPORT_FAQ, suggestVehicles } from '../data/fleet';
import { useSeo } from '../lib/seo';

const TRIP_TYPES = ['One Way', 'Round Trip', 'Hourly', 'Airport', 'Wedding', 'Corporate'];
const VEHICLE_OPTIONS = ['All Cars', 'Tempo Traveller', 'Mini Bus', 'Large Bus', 'Luxury', 'Swift Dzire', 'Innova Crysta', '12 Seater TT', '45 Seater Bus'];

const inputClass = 'mt-1.5 w-full h-11 rounded-[12px] bg-[#0A0A0A] border border-white/10 px-3 text-[14px] focus:border-[#D4AF37]/40 outline-none text-white';

export default function TransportationPage() {
  useSeo('Outstation cabs from Mumbai', 'Sedans, tempo travellers and coaches from Mumbai for airport runs, one-way drops and group trips across Maharashtra and out of the city.');
  const [category, setCategory] = useState('All');
  const [pax, setPax] = useState(12);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ tripType: 'One Way', vehicleCat: 'All Cars', pickup: '', drop: '', datetime: '', pax: '4' });
  const [quote, setQuote] = useState(false);

  const vehicles = category === 'All' ? FLEET : FLEET.filter((v) => v.category === category);
  const suggestions = suggestVehicles(pax);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const pickVehicle = (v) => {
    setForm((f) => ({ ...f, vehicleCat: v.name, pax: String(v.seats) }));
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.pickup) {
      alert('Please add a pickup location');
      return;
    }
    setQuote(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0A0A0A] text-[#EDE8E0]">
      <section className="mx-auto max-w-[1440px] px-5 lg:px-8 py-10 lg:py-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-10">
        <div>
          <p className="inline-flex px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[11px] tracking-widest text-[#d4af37]">MUMBAI • THANE • BADLAPUR • PAN-MAHARASHTRA</p>
          <h1 className="font-playfair text-[38px] lg:text-[60px] leading-[0.95] font-bold mt-6">One Stop For<br /><span className="italic text-[#D4AF37]">Every Ride</span><br />Car, Tempo<br />Traveller &amp; Bus</h1>
          <p className="text-[16px] lg:text-[18px] leading-[1.6] text-[#CFC9BD]/70 mt-6 max-w-[560px]">From 4-seater sedans to 49-seater luxury coaches — AC, chauffeur-driven fleet for city, outstation, airport, wedding, and corporate needs across Maharashtra.</p>
        </div>

        <div id="booking" className="bg-[#121212]/90 border border-[#D4AF37]/20 rounded-[24px] p-5 lg:p-7">
          <h2 className="font-playfair text-[24px] font-bold mb-6">Get Instant Quote</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] uppercase text-[#CFC9BD]/60">Trip Type
                <select value={form.tripType} onChange={set('tripType')} className={inputClass}>{TRIP_TYPES.map((o) => <option key={o}>{o}</option>)}</select>
              </label>
              <label className="text-[11px] uppercase text-[#CFC9BD]/60">Vehicle Category
                <select value={form.vehicleCat} onChange={set('vehicleCat')} className={inputClass}>
                  {[...new Set([form.vehicleCat, ...VEHICLE_OPTIONS])].map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
            </div>
            <label className="block text-[11px] uppercase text-[#CFC9BD]/60"><MapPin className="inline w-3 h-3 mr-1" />Pickup Location
              <input value={form.pickup} onChange={set('pickup')} placeholder="Kurla Phoenix, Airport T2, Thane Station..." className={inputClass} />
            </label>
            <label className="block text-[11px] uppercase text-[#CFC9BD]/60"><Navigation className="inline w-3 h-3 mr-1" />Drop / Destination
              <input value={form.drop} onChange={set('drop')} placeholder="Pune, Lonavala, Shirdi, Goa, Nashik..." className={inputClass} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] uppercase text-[#CFC9BD]/60"><Calendar className="inline w-3 h-3 mr-1" />Date &amp; Time
                <input type="datetime-local" value={form.datetime} onChange={set('datetime')} className={inputClass} />
              </label>
              <label className="text-[11px] uppercase text-[#CFC9BD]/60"><Users className="inline w-3 h-3 mr-1" />Passengers
                <input type="number" min="1" max="49" value={form.pax} onChange={set('pax')} className={inputClass} />
              </label>
            </div>
            <button type="submit" className="w-full h-12 bg-[#D4AF37] text-ink-950 font-semibold rounded-[12px] flex items-center justify-center gap-2">Get Quote on WhatsApp <Send size={16} /></button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 lg:px-8 py-10">
        <div className="flex flex-wrap gap-3">
          {['All', ...FLEET_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`h-10 px-5 rounded-full text-[13px] border ${category === c ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-white/70'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((v) => (
            <article key={v.id} className="rounded-[20px] bg-[#121212] border border-white/[0.06] p-4">
              <h3 className="font-playfair text-[17px] font-bold">{v.name} {v.popular && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-black">POPULAR</span>}</h3>
              <p className="text-[11px] text-[#d4af37] mt-1">{v.seater} • {v.type}</p>
              <p className="text-[11px] text-white/40 mt-1">{v.ideal}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{v.features.map((f) => <span key={f} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] text-white/60">{f}</span>)}</div>
              <div className="mt-4 flex items-center justify-between">
                <div><div className="text-[18px] font-semibold">{v.price}</div><div className="text-[11px] text-white/40">Day rent {v.dayRent}</div></div>
                <button onClick={() => pickVehicle(v)} className="h-9 px-4 rounded-full border border-[#D4AF37]/20 text-[12px] text-[#d4af37]">Enquire</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 lg:px-8 py-10">
        <h2 className="font-playfair text-[28px] font-bold">How many people are travelling?</h2>
        <div className="mt-4 flex items-center gap-4 max-w-md">
          <input type="range" min="1" max="49" value={pax} onChange={(e) => setPax(Number(e.target.value))} className="flex-1 accent-[#D4AF37]" aria-label="Passengers" />
          <span className="text-[20px] font-bold text-[#D4AF37]">{pax}</span>
        </div>
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {suggestions.map((v) => (
            <button key={v.id} onClick={() => pickVehicle(v)} className="text-left rounded-[18px] bg-[#121212] border border-white/5 p-4">
              <div className="text-[11px] text-[#d4af37]">{v.seater}</div>
              <div className="font-playfair text-[18px] font-bold mt-1">{v.name}</div>
              <div className="text-[14px] font-semibold mt-2">{v.price}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 lg:px-8 py-10 overflow-x-auto">
        <h2 className="font-playfair text-[26px] font-bold">Transparent Pricing • Mumbai &amp; Maharashtra</h2>
        <p className="text-[13px] text-white/50 mt-1">Day rent = 300km included • Extra km charged as per slab • Driver bata separate • Toll and parking at actuals</p>
        <table className="mt-4 w-full text-left text-[13px] min-w-[720px]">
          <thead><tr className="text-white/40">{['Vehicle', 'Seater', 'Day Rent (300km)', 'Extra KM', 'Driver Bata'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{RATE_CHART.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className="px-4 py-3 text-white/70">{c}</td>)}</tr>)}</tbody>
        </table>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 lg:px-8 py-12">
        <h2 className="font-playfair text-[32px] font-bold">Services Across Maharashtra</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRANSPORT_SERVICES.map((s) => (
            <div key={s.title} className="rounded-[20px] bg-[#121212] border border-white/5 p-6">
              <h3 className="font-playfair text-[18px] font-bold">{s.title}</h3>
              <p className="text-[13px] text-white/50 mt-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 lg:px-8 py-10">
        <h2 className="font-playfair text-[28px] font-bold">Frequently Asked Questions</h2>
        <div className="mt-6 rounded-[20px] bg-[#121212] border border-white/5 divide-y divide-white/5">
          {TRANSPORT_FAQ.map((f, i) => (
            <div key={f.q} className="p-5">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="w-full flex justify-between text-left text-[14px] font-medium">
                {f.q}<ChevronDown className={`w-4 h-4 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="mt-3 text-[13px] text-white/50">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
      <QuoteDrawer
        open={quote}
        onClose={() => setQuote(false)}
        context={{
          type: 'transport',
          title: `${form.tripType}: ${form.pickup}${form.drop ? ` to ${form.drop}` : ''}`,
          subtitle: form.vehicleCat,
          stay: false,
          extra: [
            ['Trip', form.tripType],
            ['Vehicle', form.vehicleCat],
            ['Pickup', form.pickup],
            ['Drop', form.drop],
            ['When', form.datetime],
            ['Passengers', form.pax],
          ],
        }}
      />
    </div>
  );
}
