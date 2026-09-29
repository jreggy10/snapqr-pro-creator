import qrcode from "qrcode-generator";
import type { ErrorCorrectionLevel } from "qr-code-styling";
import type { QRStyle } from "./types";
import { effectiveEcc, toUtf8ByteString } from "./render";

export type ScanLevel = "ok" | "warn" | "fail";

export interface ScanIssue {
  level: Exclude<ScanLevel, "ok">;
  message: string;
}

export interface ScanReport {
  level: ScanLevel;
  issues: ScanIssue[];
  moduleCount: number;
}

/** Fraction of modules each ECC level can recover. */
const ECC_RECOVERY: Record<ErrorCorrectionLevel, number> = { L: 0.07, M: 0.15, Q: 0.25, H: 0.3 };

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function hexToRgb(hex: string): [number, number, number] {
  const m = HEX_RE.exec(hex.trim());
  if (!m) return [0, 0, 0];
  let h = m[1];
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Returns 0 if the payload doesn't fit in a version-40 code. */
export function getModuleCount(payload: string, ecc: ErrorCorrectionLevel): number {
  try {
    const qr = qrcode(0, ecc);
    qr.addData(toUtf8ByteString(payload), "Byte");
    qr.make();
    return qr.getModuleCount();
  } catch {
    return 0;
  }
}

const worst = (issues: ScanIssue[]): ScanLevel =>
  issues.some((i) => i.level === "fail") ? "fail" : issues.length ? "warn" : "ok";

/** Instant checks that don't need rendering. */
export function checkHeuristics(payload: string, style: QRStyle): ScanReport {
  const issues: ScanIssue[] = [];
  const ecc = effectiveEcc(style);
  const moduleCount = getModuleCount(payload, ecc);

  if (!moduleCount) {
    return {
      level: "fail",
      moduleCount: 0,
      issues: [{ level: "fail", message: "Too much data for one QR code. Shorten it or use a link." }],
    };
  }

  const ratio = contrastRatio(style.fg, style.bg);
  if (ratio < 2) {
    issues.push({ level: "fail", message: `Contrast is too low (${ratio.toFixed(1)}:1). Use darker dots or a lighter background.` });
  } else if (ratio < 4) {
    issues.push({ level: "warn", message: `Contrast is low (${ratio.toFixed(1)}:1). Some phones may struggle in dim light.` });
  }

  if (relativeLuminance(style.fg) > relativeLuminance(style.bg)) {
    issues.push({ level: "warn", message: "Light dots on a dark background. Some older scanner apps can't read inverted codes." });
  }

  if (style.logo) {
    const covered = style.logoSize ** 2;
    const budget = ECC_RECOVERY[ecc];
    if (covered > budget) {
      issues.push({ level: "fail", message: "The logo covers too much of the code. Make it smaller." });
    } else if (covered > budget * 0.5) {
      issues.push({ level: "warn", message: "The logo is large. Test with a phone before printing." });
    }
  }

  if (style.margin < 2) {
    issues.push({ level: "warn", message: "The quiet zone is narrow. Leave a border when you place the code." });
  }

  const pxPerModule = style.size / (moduleCount + style.margin * 2);
  if (pxPerModule < 3) {
    issues.push({ level: "warn", message: "The code is dense for this export size. Raise the resolution or shorten the content." });
  }

  if (moduleCount > 57) {
    issues.push({ level: "warn", message: "Lots of data makes a dense code. Print it at least 3 cm (1.2 in) wide." });
  }

  return { level: worst(issues), issues, moduleCount };
}

/**
 * Decode a rendered PNG with jsQR and compare it to the payload.
 * The decode is authoritative: a failure here overrides the heuristics.
 */
export async function verifyDecode(png: Blob, payload: string): Promise<boolean> {
  const { default: jsQR } = await import("jsqr");
  const bitmap = await createImageBitmap(png);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(data, width, height, { inversionAttempts: "attemptBoth" });
  return result?.data === payload;
}

/** Test-decode sizes, scaled so each module is ~6, 9, and 12 px. */
export function decodeSizes(moduleCount: number, margin: number): number[] {
  const total = moduleCount + margin * 2;
  return [6, 9, 12].map((px) => Math.min(1200, Math.max(240, Math.round(total * px))));
}

/**
 * `passed` of `attempts` test decodes succeeded (null = not run yet).
 * None passing is a hard fail; a partial pass means the design is borderline.
 */
export function mergeDecode(report: ScanReport, passed: number | null, attempts = 3): ScanReport {
  if (passed === null || passed === attempts) return report;
  const issue: ScanIssue =
    passed === 0
      ? { level: "fail", message: "A test scan of this design failed. Try more contrast, a smaller logo, or simpler dot styles." }
      : { level: "warn", message: "This design only scans at some sizes. Square dots or less content will make it more reliable." };
  const issues = [issue, ...report.issues];
  return { ...report, level: worst(issues), issues };
}
