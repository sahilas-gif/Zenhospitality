import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bot, Compass, Loader2, MessageCircle, Phone, Send, Sparkles, X } from 'lucide-react';
import api from '../lib/api';
import { CONTACT } from '../data/contact';
import { whatsappUrl } from '../lib/whatsapp';

const GREETING = { role: 'model', content: "Hello, I'm the Zen concierge. Ask me about hotels, tours, cabs or corporate travel." };

function formatMessage(text) {
  return String(text)
    .split(/(\*\*.*?\*\*)/g)
    .map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>));
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => bottom.current?.scrollIntoView({ block: 'end' }), [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { messages: next.slice(1) }, { timeout: 60000 });
      setMessages((m) => [...m, { role: 'model', content: data.response, fallback: data.fallback }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'model', fallback: true, content: `I can't answer right now. Please WhatsApp or call us on ${CONTACT.phonePrimary}.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-label="Chat with the Zen concierge" className="glass-nav flex h-[min(70dvh,560px)] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-gold/10 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/15 text-gold"><Bot className="h-4 w-4" /></span>
          <div>
            <p className="font-display text-lg leading-none text-pearl">Zen concierge</p>
            <p className="mt-1 text-[11px] text-pearl/50">AI assistant. A person replies on WhatsApp.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-full text-pearl/70 hover:bg-white/5 hover:text-pearl">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4" data-lenis-prevent aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-gold text-ink-950' : 'rounded-bl-sm border border-gold/10 bg-ink-900/80 text-pearl/90'}`}>
              {formatMessage(m.content)}
              {m.fallback && (
                <a href={whatsappUrl('Hi Zen World Hospitality')} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold">
                  <MessageCircle className="h-3.5 w-3.5" /> Open WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-pearl/50">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
          </div>
        )}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-gold/10 p-3">
        <label htmlFor="concierge-input" className="sr-only">Message</label>
        <input
          id="concierge-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1500}
          placeholder="Ask about a stay, tour or cab"
          className="hairline min-w-0 flex-1 rounded-full bg-ink-950/60 px-4 py-2.5 text-sm text-pearl placeholder:text-pearl/35 focus:border-gold/50 focus:outline-none"
        />
        <button type="submit" disabled={!input.trim() || loading} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink-950 disabled:opacity-40">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function ConciergeDial() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);
  const reduce = useReducedMotion();
  const root = useRef(null);

  useEffect(() => {
    if (!open && !chat) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setChat(false);
    };
    const onDoc = (e) => open && root.current && !root.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDoc);
    };
  }, [open, chat]);

  const actions = [
    { label: 'WhatsApp', icon: MessageCircle, href: whatsappUrl('Hi Zen World Hospitality, I would like some help planning.'), external: true },
    { label: `Call ${CONTACT.phonePrimary}`, icon: Phone, href: CONTACT.phonePrimaryTel },
    { label: 'Ask the AI concierge', icon: Sparkles, onClick: () => { setChat(true); setOpen(false); } },
    { label: 'Plan a trip', icon: Compass, to: '/plan-trip' },
  ];

  const item = (a) => {
    const cls = 'flex items-center gap-3 rounded-full py-2 pl-2 pr-4 text-sm text-pearl glass-nav hover:text-gold transition-colors';
    const inner = (
      <>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/15 text-gold"><a.icon className="h-4 w-4" /></span>
        {a.label}
      </>
    );
    if (a.to) return <Link to={a.to} onClick={() => setOpen(false)} className={cls}>{inner}</Link>;
    if (a.href) return <a href={a.href} target={a.external ? '_blank' : undefined} rel={a.external ? 'noreferrer' : undefined} onClick={() => setOpen(false)} className={cls}>{inner}</a>;
    return <button type="button" onClick={a.onClick} className={cls}>{inner}</button>;
  };

  return (
    <div ref={root} className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {chat && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <ChatPanel onClose={() => setChat(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && !chat && (
          <motion.ul id="concierge-actions" className="flex flex-col items-end gap-2" initial="hidden" animate="show" exit="hidden">
            {actions.map((a, i) => (
              <motion.li
                key={a.label}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : (actions.length - i) * 0.04 }}
              >
                {item(a)}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {!chat && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="concierge-actions"
          aria-label={open ? 'Close concierge menu' : 'Talk to Zen'}
          className="group relative grid h-14 w-14 place-items-center rounded-full bg-gold text-ink-950 shadow-[0_12px_40px_-10px_rgba(212,175,55,0.7)] transition-transform duration-300 hover:scale-105"
        >
          {!open && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.4s]" />}
          <span className={`relative transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </span>
        </button>
      )}
    </div>
  );
}
