const PptxGenJS = require("pptxgenjs");
const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE";
pres.author = "Sahil Singh";
pres.title = "Zen World Hospitality — Demo";
pres.subject = "MCA industry project viva";

const ink = "060D17";
const gold = "D4AF37";
const pearl = "F8FAFC";
const card = "0A192F";

function dark(slide) {
  slide.background = { color: ink };
}

const s1 = pres.addSlide();
dark(s1);
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: gold } });
s1.addText("KJSIM  ·  MCA  ·  ROLL 53", { x: 0.6, y: 1.6, w: 12, h: 0.35, fontFace: "Calibri", fontSize: 14, color: gold, margin: 0 });
s1.addText("Zen World Hospitality", { x: 0.6, y: 2.1, w: 12, h: 0.9, fontFace: "Georgia", fontSize: 40, color: pearl, margin: 0 });
s1.addText("Hotels, tours, and a WhatsApp enquiry.\nzenhospitality.in", { x: 0.6, y: 3.2, w: 10, h: 0.9, fontFace: "Calibri", fontSize: 18, color: "E2E8F0", margin: 0 });
s1.addText("Sahil Singh   ·   Guide: Prof. Naimesh Tungare   ·   Client: Mr. Raj Kumar", { x: 0.6, y: 6.6, w: 12, h: 0.35, fontFace: "Calibri", fontSize: 14, color: "94A3B8", margin: 0 });

const s2 = pres.addSlide();
dark(s2);
s2.addText("The problem", { x: 0.6, y: 0.4, w: 12, h: 0.5, fontFace: "Georgia", fontSize: 28, color: gold, margin: 0 });
s2.addText([
  { text: "No single catalogue", options: { bullet: true, breakLine: true } },
  { text: "OTAs take 15% to 25% on a booking", options: { bullet: true, breakLine: true } },
  { text: "Leads sat in personal WhatsApp chats", options: { bullet: true, breakLine: true } },
  { text: "A WordPress theme on the same host was slow and off-brand", options: { bullet: true } },
], { x: 0.6, y: 1.4, w: 11, h: 3.2, fontFace: "Calibri", fontSize: 22, color: pearl, paraSpaceAfter: 14 });

const s3 = pres.addSlide();
dark(s3);
s3.addText("What a visitor does", { x: 0.6, y: 0.4, w: 12, h: 0.5, fontFace: "Georgia", fontSize: 28, color: gold, margin: 0 });
const steps = [
  ["1", "Browse", "Hotels, domestic tours, company travel, cabs"],
  ["2", "Plan", "AI trip planner, or the chat button"],
  ["3", "Quote", "Saved enquiry, then WhatsApp"],
  ["4", "Book", "Zen confirms. Payment stays offline"],
];
steps.forEach((row, i) => {
  const y = 1.3 + i * 1.3;
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 11.8, h: 1.1, fill: { color: card }, rectRadius: 0.1 });
  s3.addText(row[0], { x: 0.8, y: y + 0.25, w: 0.7, h: 0.6, fontFace: "Georgia", fontSize: 26, color: gold, margin: 0 });
  s3.addText(row[1], { x: 1.7, y: y + 0.15, w: 3, h: 0.4, fontFace: "Calibri", fontSize: 20, color: pearl, margin: 0, bold: true });
  s3.addText(row[2], { x: 1.7, y: y + 0.55, w: 9, h: 0.35, fontFace: "Calibri", fontSize: 16, color: "CBD5E1", margin: 0 });
});

const s4 = pres.addSlide();
dark(s4);
s4.addText("What Mr. Raj Kumar told me", { x: 0.6, y: 0.45, w: 12, h: 0.5, fontFace: "Georgia", fontSize: 28, color: gold, margin: 0 });
s4.addText("His numbers. I did not pull them from the database.", { x: 0.6, y: 1.1, w: 12, h: 0.35, fontFace: "Calibri", fontSize: 14, color: "94A3B8", margin: 0 });
const stats = [["10+", "calls"], ["~5", "bookings"], ["₹20,000", "profit"]];
stats.forEach((st, i) => {
  const x = 0.6 + i * 4.1;
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.1, w: 3.8, h: 2.8, fill: { color: card }, rectRadius: 0.12 });
  s4.addText(st[0], { x, y: 2.5, w: 3.8, h: 1.2, fontFace: "Georgia", fontSize: 40, color: gold, align: "center", margin: 0 });
  s4.addText(st[1], { x, y: 3.8, w: 3.8, h: 0.5, fontFace: "Calibri", fontSize: 20, color: pearl, align: "center", margin: 0 });
});

const s5 = pres.addSlide();
dark(s5);
s5.addText("Still open", { x: 0.6, y: 0.4, w: 12, h: 0.5, fontFace: "Georgia", fontSize: 28, color: gold, margin: 0 });
s5.addText([
  { text: "International tours: Coming Soon", options: { bullet: true, breakLine: true } },
  { text: "Flight ticketing: Coming Soon", options: { bullet: true, breakLine: true } },
  { text: "Gemini can be busy. The site falls through to WhatsApp", options: { bullet: true, breakLine: true } },
  { text: "Demo: zenhospitality.in", options: { bullet: true } },
], { x: 0.6, y: 1.5, w: 11, h: 3.5, fontFace: "Calibri", fontSize: 22, color: pearl, paraSpaceAfter: 16 });
s5.addText("Final documents 22 Oct 2026  ·  Viva 21 Oct 2026", { x: 0.6, y: 6.5, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 16, color: "94A3B8", margin: 0 });

pres.writeFile({ fileName: "/Users/sahil/zenhospitality/docs/second_draft/demo.pptx" })
  .then(() => console.log("wrote deck"))
  .catch((err) => { console.error(err); process.exit(1); });
