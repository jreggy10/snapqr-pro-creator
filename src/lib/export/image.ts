import type { QRDesign } from "@/lib/qr/types";
import { renderPng, renderSvgText } from "@/lib/qr/instance";
import { FONT_STACK, canvasToBlob, wrapText } from "./files";

const CAPTION_LINE = 0.07;

/** PNG of the code, with the caption drawn underneath when set. */
export async function exportPng(payload: string, design: QRDesign): Promise<Blob> {
  const { style, caption } = design;
  const size = style.size;
  const qr = await renderPng(payload, style, size);
  const text = caption.trim();
  if (!text) return qr;

  const fontSize = Math.round(size * 0.05);
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `600 ${fontSize}px ${FONT_STACK}`;
  const lines = wrapText(measure, text, size * 0.9, 2);
  const lineHeight = size * CAPTION_LINE;
  const captionHeight = Math.round(lines.length * lineHeight + size * 0.04);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size + captionHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = style.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const bitmap = await createImageBitmap(qr);
  ctx.drawImage(bitmap, 0, 0, size, size);
  bitmap.close();

  ctx.fillStyle = style.fg;
  ctx.font = measure.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, i) => ctx.fillText(line, size / 2, size + lineHeight * (i + 0.5)));
  return canvasToBlob(canvas);
}

/** Vector SVG, with the caption as real `<text>` so it stays editable. */
export async function exportSvgText(payload: string, design: QRDesign, size = 1000): Promise<string> {
  const { style, caption } = design;
  const svg = await renderSvgText(payload, style, size);
  const text = caption.trim();
  if (!text) return svg;

  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;
  const NS = "http://www.w3.org/2000/svg";
  const fontSize = size * 0.05;
  const captionHeight = size * (CAPTION_LINE + 0.04);
  const total = size + captionHeight;

  root.setAttribute("height", String(total));
  root.setAttribute("viewBox", `0 0 ${size} ${total}`);

  const bg = doc.createElementNS(NS, "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", String(size - 1));
  bg.setAttribute("width", String(size));
  bg.setAttribute("height", String(captionHeight + 1));
  bg.setAttribute("fill", style.bg);
  root.appendChild(bg);

  const label = doc.createElementNS(NS, "text");
  label.setAttribute("x", String(size / 2));
  label.setAttribute("y", String(size + (size * CAPTION_LINE) / 2));
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("dominant-baseline", "middle");
  label.setAttribute("font-family", FONT_STACK.replace(/"/g, "'"));
  label.setAttribute("font-weight", "600");
  label.setAttribute("font-size", String(fontSize));
  label.setAttribute("fill", style.fg);
  label.textContent = text;
  root.appendChild(label);

  return new XMLSerializer().serializeToString(doc);
}
