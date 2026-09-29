import type { CardTheme, QRDesign } from "@/lib/qr/types";
import { renderPng } from "@/lib/qr/instance";
import { relativeLuminance } from "@/lib/qr/scannability";
import { FONT_STACK, canvasToBlob, wrapText } from "./files";

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

interface Palette {
  bg: string;
  text: string;
  muted: string;
}

function paletteFor(theme: CardTheme, fg: string): Palette {
  switch (theme) {
    case "dark":
      return { bg: "#101014", text: "#ffffff", muted: "rgba(255,255,255,0.65)" };
    case "brand": {
      const light = relativeLuminance(fg) > 0.4;
      return light
        ? { bg: fg, text: "#111111", muted: "rgba(0,0,0,0.6)" }
        : { bg: fg, text: "#ffffff", muted: "rgba(255,255,255,0.75)" };
    }
    default:
      return { bg: "#f6f5f2", text: "#111111", muted: "rgba(0,0,0,0.55)" };
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * 1080×1920 "show this" card for a phone screen. The code always sits on
 * its own background panel so the card theme can't hurt scanning.
 */
export async function exportCard(payload: string, design: QRDesign): Promise<Blob> {
  const { card, style, caption } = design;
  const palette = paletteFor(card.theme, style.fg);
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const cx = CARD_WIDTH / 2;
  const maxText = CARD_WIDTH - 160;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Text block above the code.
  ctx.font = `700 92px ${FONT_STACK}`;
  const titleLines = card.title.trim() ? wrapText(ctx, card.title.trim(), maxText, 3) : [];
  ctx.font = `400 46px ${FONT_STACK}`;
  const subtitleLines = card.subtitle.trim() ? wrapText(ctx, card.subtitle.trim(), maxText, 3) : [];
  const textHeight = titleLines.length * 104 + (subtitleLines.length ? 28 + subtitleLines.length * 60 : 0);

  const panelSize = 840;
  const captionHeight = caption.trim() ? 90 : 0;
  const panelHeight = panelSize + captionHeight;
  const blockHeight = textHeight + (textHeight ? 90 : 0) + panelHeight;
  let y = Math.max(160, (CARD_HEIGHT - 140 - blockHeight) / 2);

  ctx.fillStyle = palette.text;
  ctx.font = `700 92px ${FONT_STACK}`;
  for (const line of titleLines) {
    y += 92;
    ctx.fillText(line, cx, y);
    y += 12;
  }
  if (subtitleLines.length) {
    y += 28;
    ctx.fillStyle = palette.muted;
    ctx.font = `400 46px ${FONT_STACK}`;
    for (const line of subtitleLines) {
      y += 46;
      ctx.fillText(line, cx, y);
      y += 14;
    }
  }
  if (textHeight) y += 90;

  // Code panel.
  const panelX = (CARD_WIDTH - panelSize) / 2;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = style.bg;
  roundRect(ctx, panelX, y, panelSize, panelHeight, 48);
  ctx.fill();
  ctx.restore();

  const qrInset = 40;
  const qrSize = panelSize - qrInset * 2;
  const qr = await renderPng(payload, style, qrSize);
  const bitmap = await createImageBitmap(qr);
  ctx.drawImage(bitmap, panelX + qrInset, y + qrInset, qrSize, qrSize);
  bitmap.close();

  if (captionHeight) {
    ctx.fillStyle = style.fg;
    ctx.font = `600 44px ${FONT_STACK}`;
    const [line] = wrapText(ctx, caption.trim(), panelSize - 80, 1);
    ctx.fillText(line, cx, y + panelSize + 20);
  }

  // Footer hint.
  ctx.fillStyle = palette.muted;
  ctx.font = `500 38px ${FONT_STACK}`;
  ctx.fillText("Scan with your phone camera", cx, CARD_HEIGHT - 120);

  return canvasToBlob(canvas);
}
