import { useState } from 'react';
import { Sparkles, Map, Calendar, IndianRupee, Heart, Loader2 } from 'lucide-react';
import api from '../lib/api';
import ScrollReveal from './ScrollReveal';
import ItineraryModal from './ItineraryModal';

const AiItineraryGenerator = () => {
  const [formData, setFormData] = useState({ destination: '', duration_days: '', budget: '', interests: '' });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const generateSmartFallback = () => {
    const dest = formData.destination || 'Paradise';
    const days = parseInt(formData.duration_days) || 5;
    const budget = formData.budget || 'standard';
    const interests = formData.interests || 'leisure';

    const budgetLabel = { economy: 'Budget-Friendly', standard: 'Comfort', luxury: 'Luxury' }[budget] || 'Comfort';

    const activityPool = {
      morning: ['Guided City Tour', 'Yoga at Sunrise', 'Local Market Visit', 'Heritage Walk', 'Cooking Class', 'Temple Visit', 'Scenic Hike', 'Beach Volleyball'],
      afternoon: ['Spa Treatment', 'Water Sports', 'Museum Tour', 'Wine Tasting', 'Culinary Workshop', 'Snorkeling Trip', 'Shopping Spree', 'Poolside Relaxation'],
      evening: ['Sunset Cruise', 'Candlelight Dinner', 'Traditional Dance Show', 'Rooftop Drinks', 'Night Market Tour', 'Live Music Night', 'Stargazing', 'Beach Barbecue'],
    };

    const generatedDays = Array.from({ length: Math.min(days, 10) }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? 'Arrival & Welcome' : i === days - 1 ? 'Departure Day' : ['Exploration', 'Adventure', 'Culture', 'Relaxation', 'Discovery', 'Indulgence', 'Nature'][i % 7],
      activities: [
        i === 0 ? 'Airport Transfer & Check-in' : activityPool.morning[i % activityPool.morning.length],
        i === 0 ? `Welcome ${budgetLabel} Dinner` : activityPool.afternoon[(i + 2) % activityPool.afternoon.length],
        i === days - 1 ? 'Farewell Breakfast' : activityPool.evening[(i + 1) % activityPool.evening.length],
        i === days - 1 ? 'Airport Drop' : 'Evening Leisure',
      ],
    }));

    return {
      title: `${budgetLabel} ${formData.duration_days || 5} Days in ${dest}`,
      description: `A ${budget} journey focused on ${interests}, crafted just for you.`,
      days: generatedDays,
      travel_tips: ['Carry comfortable walking shoes', 'Try local cuisine', 'Stay hydrated', 'Capture memories'],
      budget_summary: `Estimated range: ${budget === 'luxury' ? '₹1,50,000' : budget === 'standard' ? '₹75,000' : '₹35,000'} - ₹2,50,000 per person.`,
    };
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary(null);
    setShowModal(true);

    try {
      const { data } = await api.post('/ai/generate-itinerary', formData);
      const d = data.itinerary_data || data;
      if (d.days && d.days.length > 0) {
        setItinerary({
          title: `${formData.duration_days || 5} Days in ${formData.destination || 'Paradise'}`,
          description: 'A customized journey powered by AI, tailored to your preferences.',
          days: d.days,
          travel_tips: d.travel_tips || [],
          budget_summary: d.budget_summary || '',
        });
      } else {
        setItinerary(generateSmartFallback());
      }
    } catch {
      setItinerary(generateSmartFallback());
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#0c1222]" id="ai-trip-planner">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-500 font-medium tracking-widest uppercase text-sm">AI Trip Planner</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">Powered by Artificial Intelligence</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Describe your dream trip and our AI will generate a personalized day-by-day itinerary in seconds.</p>
          </div>
        </ScrollReveal>

        <div className="max-w-xl mx-auto">
          <ScrollReveal>
            <form onSubmit={handleGenerate} className="glass-card p-5 md:p-8 rounded-2xl">
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><Map className="w-3.5 h-3.5 mr-1.5" /> Destination</label>
                  <input required type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g., Bali, Switzerland, Goa" className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" /> Duration (Days)</label>
                    <input required type="number" min="1" max="30" name="duration_days" value={formData.duration_days} onChange={handleChange} placeholder="e.g. 5" className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><IndianRupee className="w-3.5 h-3.5 mr-1.5" /> Budget</label>
                    <select required name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      <option value="">Select</option>
                      <option value="economy">Economy (₹)</option>
                      <option value="standard">Standard (₹₹)</option>
                      <option value="luxury">Luxury (₹₹₹)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><Heart className="w-3.5 h-3.5 mr-1.5" /> Interests</label>
                  <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g., Beach, History, Food, Adventure" className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg font-bold text-sm md:text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex justify-center items-center disabled:opacity-70">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating...</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Itinerary</>}
                </button>
              </div>
            </form>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {['Bali', 'Switzerland', 'Maldives', 'Goa', 'Kerala'].map((dest) => (
                  <button key={dest} type="button" onClick={() => setFormData((f) => ({ ...f, destination: dest }))} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors border border-gray-700">
                    {dest}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-3">Tap a destination to fill it in, then generate your itinerary</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {showModal && (
        <ItineraryModal
          itinerary={itinerary}
          loading={loading}
          onClose={() => { setShowModal(false); setItinerary(null); }}
        />
      )}
    </section>
  );
};

export default AiItineraryGenerator;
