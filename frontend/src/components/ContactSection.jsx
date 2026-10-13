import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Facebook, Instagram } from './ui/BrandIcons';
import { CONTACT } from '../data/contact';
import { whatsappUrl } from '../lib/whatsapp';

const FORM_ENDPOINT = 'https://formspree.io/f/xnpjgbnq';

const INFO_CARDS = [
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phonePrimary,
    sub: CONTACT.hours,
    href: CONTACT.phonePrimaryTel,
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-400/25',
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.emailPrimary,
    sub: 'We reply within 24 hours',
    href: CONTACT.emailPrimaryMailto,
    badgeClass: 'bg-amber-500/15 text-[#e8d5a8] border-[#d4af37]/30',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Andheri East, Mumbai',
    sub: 'Maharashtra, India',
    href: null,
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  },
];

const SOCIAL_QR_CARDS = [
  {
    heading: 'Follow Us on Instagram',
    qr: '/images/social/instagram.svg',
    qrAlt: 'Zen World Hospitality Instagram QR code',
    caption: 'ZENHOSPITALITY1587',
    pillText: '@zenhospitality1587',
    href: CONTACT.instagram,
    Icon: Instagram,
    captionColor: 'text-[#f472b6]',
    pillClass:
      'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-[0_10px_28px_-6px_rgba(221,42,123,0.55)] hover:brightness-110',
  },
  {
    heading: 'Follow Us on Facebook',
    qr: '/images/social/facebook.svg',
    qrAlt: 'Zen World Hospitality Facebook QR code',
    caption: 'ZEN WORLD HOSPITALITY',
    pillText: 'Zen World Hospitality',
    href: CONTACT.facebook,
    Icon: Facebook,
    captionColor: 'text-[#60a5fa]',
    pillClass:
      'bg-[#1877F2] text-white shadow-[0_10px_28px_-6px_rgba(24,119,242,0.55)] hover:bg-[#166fe5]',
  },
];

const ContactSection = ({ showForm = true }) => {
  const [status, setStatus] = useState('idle');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-gold/10 bg-ink-950 py-20 md:py-28">
      <div className="glow-gold pointer-events-none absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 opacity-70" />

      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-pearl md:text-5xl">
            Get In Touch
          </h2>
          <div className="mx-auto my-4 h-0.5 w-12 rounded-full bg-gold" />
          <p className="text-sm leading-relaxed text-pearl/65 md:text-base">
            Planning a stay, a family tour, or company travel? Reach out to our Mumbai desk for rates, dates, or a quick quote.
          </p>
        </div>

        {/* Top 2-Column Block: WhatsApp Feature Card + 3 Stacked Info Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left: Highlighted WhatsApp Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#25D366]/30 bg-gradient-to-br from-[#0d2e22] via-[#0a231c] to-[#081915] p-7 shadow-[0_24px_60px_-20px_rgba(37,211,102,0.22)] md:p-9 lg:col-span-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#25D366]/15 blur-3xl" />

            <div className="relative">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md shadow-[#15803d]/40">
                <MessageCircle className="h-6 w-6" />
              </div>

              <h3 className="font-display text-3xl font-semibold text-pearl md:text-[2rem]">
                Book on WhatsApp
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-pearl/75">
                Quick rates and custom quotes. Chat directly with a Zen planner and get a reply with rooms, cabs, or tour dates.
              </p>
            </div>

            <div className="relative mt-7">
              <a
                href={whatsappUrl('Hi Zen World Hospitality, I would like to get a quote.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#15803d] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#15803d]/35 transition-all hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Now
              </a>
            </div>
          </div>

          {/* Right: 3 Stacked Contact Cards */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-6">
            {INFO_CARDS.map((card) => {
              const Icon = card.icon;
              const Wrapper = card.href ? 'a' : 'div';
              return (
                <Wrapper
                  key={card.label}
                  {...(card.href ? { href: card.href } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-gold/15 bg-ink-900/90 px-5 py-4 transition-all hover:border-gold/40 hover:bg-ink-900 md:px-6 md:py-5"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${card.badgeClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-pearl/55">
                      {card.label}
                    </p>
                    <p className="mt-0.5 truncate text-base font-semibold text-pearl transition-colors group-hover:text-gold md:text-lg">
                      {card.value}
                    </p>
                    <p className="mt-0.5 text-xs text-pearl/50">{card.sub}</p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>

        {/* Bottom 2-Column Social QR Showcase */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-20">
          {SOCIAL_QR_CARDS.map((item) => {
            const SocialIcon = item.Icon;
            return (
              <div key={item.heading} className="flex flex-col items-center text-center">
                <h3 className="font-display text-2xl font-semibold text-pearl md:text-3xl">
                  {item.heading}
                </h3>

                <div className="relative mt-6 flex w-full max-w-[17rem] flex-col items-center rounded-3xl border border-gold/20 bg-white px-6 pb-9 pt-6 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.65)]">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.heading}
                    className="block rounded-2xl p-1 transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <img
                      src={item.qr}
                      alt={item.qrAlt}
                      width="176"
                      height="176"
                      className="h-44 w-44 object-contain"
                    />
                  </a>

                  <p className={`mt-3 text-[0.7rem] font-bold tracking-[0.16em] ${item.captionColor}`}>
                    {item.caption}
                  </p>

                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`-mb-14 mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-transform duration-200 hover:-translate-y-0.5 ${item.pillClass}`}
                  >
                    <SocialIcon className="h-4 w-4" />
                    <span>{item.pillText}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Page Extras: Formspree Form + Embedded Map */}
        {showForm && (
          <div className="mt-24 grid grid-cols-1 gap-8 border-t border-gold/10 pt-16 lg:grid-cols-12">
            <form
              onSubmit={onSubmit}
              className="space-y-4 rounded-3xl border border-gold/15 bg-ink-900/80 p-6 md:p-8 lg:col-span-6"
            >
              <div>
                <p className="eyebrow">Direct message</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-pearl md:text-3xl">
                  Send an enquiry by email
                </h3>
                <p className="mt-1 text-xs text-pearl/55">
                  Delivered straight to {CONTACT.emailPrimary}.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-pearl/70" htmlFor="contact-name">
                  Name
                  <input
                    id="contact-name"
                    name="name"
                    required
                    className="mt-1.5 w-full rounded-xl border border-gold/15 bg-ink-950 px-3.5 py-2.5 text-sm text-pearl focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-medium text-pearl/70" htmlFor="contact-phone">
                  Phone
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    className="mt-1.5 w-full rounded-xl border border-gold/15 bg-ink-950 px-3.5 py-2.5 text-sm text-pearl focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <label className="block text-xs font-medium text-pearl/70" htmlFor="contact-email">
                Email
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 w-full rounded-xl border border-gold/15 bg-ink-950 px-3.5 py-2.5 text-sm text-pearl focus:border-gold focus:outline-none"
                />
              </label>

              <label className="block text-xs font-medium text-pearl/70" htmlFor="contact-message">
                Dates, destination or requirements
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  className="mt-1.5 w-full rounded-xl border border-gold/15 bg-ink-950 px-3.5 py-2.5 text-sm text-pearl focus:border-gold focus:outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-[#e3c14d] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>

              {status === 'sent' && (
                <p role="status" className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Message sent. Our team will reply by email.
                </p>
              )}
              {status === 'error' && (
                <p role="alert" className="flex items-center gap-2 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Could not send right now. Use the WhatsApp button above for an immediate reply.
                </p>
              )}
            </form>

            <div className="min-h-[320px] overflow-hidden rounded-3xl border border-gold/15 lg:col-span-6">
              <iframe
                src="https://maps.google.com/maps?q=Andheri+Bhim+Nagar,+Andheri+East+Mumbai,+Maharashtra+400059&t=m&z=11&output=embed&iwloc=near"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(85%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zen World Hospitality Location"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
