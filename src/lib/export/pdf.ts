import type { QRDesign } from "@/lib/qr/types";
import { exportSvgText } from "./image";

export type PdfPreset = "letter" | "a4" | "sign4x6";

export const PDF_PRESETS: Record<PdfPreset, { label: string; width: number; height: number }> = {
  letter: { label: "US Letter", width: 612, height: 792 },
  a4: { label: "A4", width: 595.28, height: 841.89 },
  sign4x6: { label: "4×6 sign", width: 288, height: 432 },
};

/** Vector PDF: title, the code, and the caption centered on the page. Loaded on demand. */
export async function exportPdf(payload: string, design: QRDesign, preset: PdfPreset): Promise<Blob> {
  const [{ jsPDF }, { svg2pdf }] = await Promise.all([import("jspdf"), import("svg2pdf.js")]);
  const page = PDF_PRESETS[preset];
  const pdf = new jsPDF({ unit: "pt", format: [page.width, page.height], orientation: "portrait" });

  const title = design.card.title.trim();
  const caption = design.caption.trim();
  const qrSize = page.width * 0.62;
  const x = (page.width - qrSize) / 2;
  const titleSize = page.width * 0.055;
  const captionSize = page.width * 0.04;
  const gap = page.width * 0.05;

  const blockHeight = qrSize + (title ? titleSize + gap : 0) + (caption ? captionSize + gap : 0);
  let y = (page.height - blockHeight) / 2;

  if (title) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(titleSize);
    pdf.text(pdf.splitTextToSize(title, page.width * 0.85)[0], page.width / 2, y + titleSize * 0.8, { align: "center" });
    y += titleSize + gap;
  }

  // Render the QR without the caption; the PDF sets its own type.
  const svgText = await exportSvgText(payload, { ...design, caption: "" }, 1000);
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-99999px;top:0;";
  host.innerHTML = svgText;
  document.body.appendChild(host);
  try {
    const svg = host.querySelector("svg")!;
    await svg2pdf(svg, pdf, { x, y, width: qrSize, height: qrSize });
  } finally {
    host.remove();
  }
  y += qrSize + gap;

  if (caption) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(captionSize);
    pdf.text(pdf.splitTextToSize(caption, page.width * 0.85)[0], page.width / 2, y + captionSize * 0.5, { align: "center" });
  }

  return pdf.output("blob");
}
