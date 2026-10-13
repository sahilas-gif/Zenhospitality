import { CONTACT } from '../data/contact';

export function whatsappUrl(text = '') {
  const base = `https://wa.me/${CONTACT.phonePrimaryWhatsApp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// Builds a readable message from label/value pairs, skipping empty values.
export function buildMessage(title, fields = [], reference) {
  const lines = [title, ''];
  for (const [label, value] of fields) {
    if (value === undefined || value === null || value === '') continue;
    lines.push(`${label}: ${value}`);
  }
  if (reference) lines.push('', `Reference: ${reference}`);
  return lines.join('\n');
}

// Opens a blank tab synchronously (inside the click) so popup blockers allow it,
// then points it at WhatsApp once the message is ready.
export function openWhatsAppWindow() {
  const win = window.open('', '_blank');
  if (win) win.opener = null;
  return {
    go(text) {
      const url = whatsappUrl(text);
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
    },
    close() {
      if (win && !win.closed) win.close();
    },
  };
}
