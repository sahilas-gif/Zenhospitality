import { CONTACT } from '../data/contact';

const GOLD = [180, 138, 40];
const INK = [10, 25, 47];
const GREY = [90, 100, 115];

// jsPDF is loaded only when someone actually downloads.
export async function downloadItineraryPdf(it) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pw = pdf.internal.pageSize.getWidth();
  const maxW = pw - 30;
  let y = 0;

  const ensure = (h) => {
    if (y + h > 280) {
      pdf.addPage();
      y = 20;
    }
  };
  const write = (text, { size = 10, color = INK, bold = false, x = 15, gap = 5 } = {}) => {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    for (const line of pdf.splitTextToSize(String(text ?? ''), maxW - (x - 15))) {
      ensure(gap);
      pdf.text(line, x, y);
      y += gap;
    }
  };

  pdf.setFillColor(...INK);
  pdf.rect(0, 0, pw, 14, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(212, 175, 55);
  pdf.text('ZEN WORLD HOSPITALITY  ·  TRIP PLAN', 15, 9);
  y = 28;

  write(`${it.duration_days} days in ${it.destination}`, { size: 20, bold: true, gap: 9 });
  if (it.summary) write(it.summary, { color: GREY });
  if (it.budget_summary) write(`Budget: ${it.budget_summary}`, { color: GREY });
  y += 4;

  for (const day of it.days || []) {
    ensure(18);
    write(`Day ${day.day}: ${day.title}`, { size: 12, bold: true, color: GOLD, gap: 7 });
    for (const a of day.activities || []) {
      write(`${a.time ? `${a.time}  ` : ''}${a.activity}`, { bold: true, x: 18 });
      if (a.description) write(a.description, { color: GREY, x: 18 });
    }
    if (day.accommodation_suggestion) write(`Stay: ${day.accommodation_suggestion}${day.hotel ? ' (Zen partner hotel)' : ''}`, { x: 18 });
    if (day.estimated_cost) write(`Estimated: ${day.estimated_cost}`, { x: 18, color: GREY });
    y += 4;
  }

  if (it.travel_tips?.length) {
    ensure(14);
    write('Travel tips', { size: 12, bold: true, color: GOLD, gap: 7 });
    it.travel_tips.forEach((t) => write(`•  ${t}`, { x: 18 }));
  }

  pdf.setFontSize(8);
  pdf.setTextColor(...GREY);
  pdf.text(`AI-generated draft. Confirm with Zen: ${CONTACT.phonePrimary}  ·  ${CONTACT.emailPrimary}`, pw / 2, 290, { align: 'center' });
  pdf.save(`zen-${String(it.destination).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${it.duration_days}d.pdf`);
}
