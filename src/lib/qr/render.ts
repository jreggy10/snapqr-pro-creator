import type { ErrorCorrectionLevel, Options } from "qr-code-styling";
import type { QRStyle } from "./types";

/**
 * qr-code-styling writes each char as one byte (charCode & 0xff), which mangles
 * anything non-ASCII. Pass it a string whose chars are the UTF-8 bytes instead.
 */
export function toUtf8ByteString(s: string): string {
  let out = "";
  for (const b of new TextEncoder().encode(s)) out += String.fromCharCode(b);
  return out;
}

/** A logo covers modules, so it needs the highest recovery level. */
export const effectiveEcc = (style: QRStyle): ErrorCorrectionLevel => (style.logo ? "H" : style.ecc);

/**
 * qr-code-styling's `margin` is in px, ours is in modules.
 * `moduleCount` comes from getModuleCount() so the quiet zone scales with density.
 */
export function buildQROptions(
  data: string,
  style: QRStyle,
  size: number,
  type: "canvas" | "svg",
  moduleCount: number,
): Partial<Options> {
  const marginPx = Math.round((size / (moduleCount + style.margin * 2)) * style.margin);
  return {
    type,
    width: size,
    height: size,
    margin: marginPx,
    data: toUtf8ByteString(data),
    image: style.logo ?? undefined,
    qrOptions: { errorCorrectionLevel: effectiveEcc(style) },
    imageOptions: { hideBackgroundDots: true, imageSize: style.logoSize, margin: 4 },
    dotsOptions: { color: style.fg, type: style.dotStyle },
    cornersSquareOptions: { color: style.fg, type: style.cornerSquareStyle },
    cornersDotOptions: { color: style.fg, type: style.cornerDotStyle },
    backgroundOptions: { color: style.bg },
  };
}
