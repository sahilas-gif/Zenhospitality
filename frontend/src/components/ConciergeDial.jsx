import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import api from '../lib/api';
import { CONTACT } from '../data/contact';
import { whatsappUrl } from '../lib/whatsapp';

const GREETING = { role: 'model', content: 'Hi. Ask me about a hotel, a tour, a cab, or a company trip.' };

function LadyIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.1" />
      <path d="M8.2 7.2c.2-2.4 1.7-4 3.8-4s3.6 1.6 3.8 4" />
      <path d="M7.4 20.2v-1.4c0-2.4 2-4.3 4.6-4.3s4.6 1.9 4.6 4.3v1.4" />
      <path d="M9.2 14.6c-1.8.5-3.2 1.8-3.6 3.4" />
      <path d="M14.8 14.6c1.8.5 3.2 1.8 3.6 3.4" />
    </svg>
  );
}

function asText(value) {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return 'I could not show that reply. Ask again, or WhatsApp us.';
}

function formatMessage(text) {
  return asText(text)
    .split(/(\*\*.*?\*\*)/g)
    .map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>));
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);
  const inputRef = useRef(null);
  const sending = useRef(false);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    const list = bottom.current?.parentElement;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || sending.current) return;
    sending.current = true;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { messages: next.slice(1) }, { timeout: 60000 });
      setMessages((m) => [...m, { role: 'model', content: asText(data?.response), fallback: data?.fallback }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'model', fallback: true, content: `I can't answer right now. WhatsApp or call ${CONTACT.phonePrimary}.` },
      ]);
    } finally {
      sending.current = false;
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-label="Chat with Zen" className="glass-nav flex h-[min(70dvh,560px)] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-gold/10 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ink-950"><LadyIcon className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-lg leading-none text-pearl">Zen</p>
            <p className="mt-1 text-[11px] text-pearl/50">A person replies on WhatsApp.</p>
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
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> One moment
          </div>
        )}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-gold/10 p-3">
        <label htmlFor="zen-chat-input" className="sr-only">Message</label>
        <input
          id="zen-chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            e.stopPropagation();
            send(e);
          }}
          maxLength={1500}
          placeholder="Type a question"
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
  const [chat, setChat] = useState(false);
  const reduce = useReducedMotion();
  const root = useRef(null);

  useEffect(() => {
    if (!chat) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setChat(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [chat]);

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
            <ErrorBoundary fallback={<p className="glass-nav max-w-xs rounded-2xl px-4 py-3 text-sm text-pearl">I can't answer right now. WhatsApp or call +91 88280 15060.</p>}>
              <ChatPanel onClose={() => setChat(false)} />
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setChat((open) => !open)}
        aria-expanded={chat}
        aria-label={chat ? 'Close chat' : 'Chat with Zen'}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-gold text-ink-950 shadow-[0_12px_40px_-10px_rgba(212,175,55,0.7)] transition-transform duration-300 hover:scale-105"
      >
        {!chat && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.4s]" />}
        <span className="relative">
          {chat ? <X className="h-6 w-6" /> : <LadyIcon className="h-7 w-7" />}
        </span>
      </button>
    </div>
  );
}
