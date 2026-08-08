import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONTACT } from '../data/contact';

const ContactSection = () => (
  <section className="py-16 md:py-24 bg-[#0a0f1c] relative border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-emerald-500 font-medium tracking-widest uppercase text-sm mb-2">Get in Touch</h2>
        <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-5 md:mb-6">Contact Us</h3>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Ready to elevate your hospitality experience or plan your next journey? Reach out to us today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="glass-card p-6 md:p-10 rounded-2xl md:rounded-3xl">
          <h4 className="text-xl md:text-2xl font-playfair font-bold text-white mb-6 md:mb-8">Contact Information</h4>
          <div className="space-y-5 md:space-y-8">
            {[
              { icon: Phone, label: 'Phone', value: `${CONTACT.phonePrimary} / ${CONTACT.phoneSecondary}`, href: CONTACT.phonePrimaryTel },
              { icon: Mail, label: 'Email', value: `${CONTACT.emailPrimary} · ${CONTACT.emailSecondary}`, href: CONTACT.emailPrimaryMailto },
              { icon: MapPin, label: 'Office Location', value: CONTACT.address },
              { icon: Clock, label: 'Business Hours', value: CONTACT.hours },
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 md:mr-4">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs md:text-sm mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-base md:text-xl text-white font-medium hover:text-emerald-400 transition-colors break-all">{item.value}</a>
                  ) : (
                    <p className="text-base md:text-lg text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-800">
            <a href={`https://wa.me/${CONTACT.phonePrimaryWhatsApp}?text=Hi%20Zen%20World%20Hospitality,%20I%20have%20an%20inquiry.`} target="_blank" rel="noreferrer" className="w-full block text-center py-3.5 md:py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-all shadow-lg text-sm md:text-base">
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="min-h-[300px] md:min-h-full rounded-2xl md:rounded-3xl overflow-hidden border border-gray-800">
          <iframe src="https://maps.google.com/maps?q=Andheri+Bhim+Nagar,+Andheri+East+Mumbai,+Maharashtra+400059&t=m&z=11&output=embed&iwloc=near" width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(85%)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Zen World Hospitality Location" />
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
