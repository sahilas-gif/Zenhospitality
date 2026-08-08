import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import api from '../lib/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hello! I'm your Zen World Hospitality assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { messages: [...messages, userMsg] });
      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model', content: 'I apologize, but I am currently experiencing technical difficulties. Please call us at +91 80978 62804 for immediate assistance.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 p-3.5 md:p-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-32px)] sm:w-80 md:w-96 h-[60vh] md:h-[500px] max-h-[80vh] bg-[#0a0f1c]/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 md:p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-white p-1.5 md:p-2 rounded-full">
              <Bot className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-white text-sm md:text-base leading-tight">Zen Assistant</h3>
              <span className="text-emerald-100 text-xs flex items-center">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Online
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.map((msg, i) => {
            const formatMessage = (text) => {
              if (typeof text !== 'string') return text;
              const parts = text.split(/(\*\*.*?\*\*)/g);
              return parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
                }
                return <span key={idx}>{part}</span>;
              });
            };
            return (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-2.5 md:p-3 ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-gray-800/80 border border-gray-700 text-gray-200 rounded-tl-sm'}`}>
                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{formatMessage(msg.content)}</p>
              </div>
            </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/80 border border-gray-700 rounded-2xl rounded-tl-sm p-3 md:p-4 flex space-x-1.5 md:space-x-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 md:p-4 border-t border-gray-800 bg-gray-900/50">
          <form onSubmit={handleSend} className="relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 md:py-3 pl-3 md:pl-4 pr-10 md:pr-12 text-xs md:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" disabled={isLoading} />
            <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
