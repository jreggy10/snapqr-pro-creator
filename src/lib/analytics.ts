import type { QRType } from "@/lib/qr/types";
import type { ScanLevel } from "@/lib/qr/scannability";

/**
 * Anonymous feature-usage events for Umami (cookieless; the script in
 * index.html only reports from the live domain).
 *
 * Privacy rule: events carry fixed labels only — never payloads, captions,
 * card text, colors typed by the user, or logos. The types below enforce it.
 */
export type ExportFormat = "png" | "svg" | "pdf-letter" | "pdf-a4" | "pdf-sign4x6" | "card" | "copy";

interface EventMap {
  "qr-type": { type: QRType };
  export: { format: ExportFormat; type: QRType; scan: ScanLevel; logo: boolean };
  preset: { name: string };
  "logo-upload": Record<string, never>;
}

interface Umami {
  track: (event: string, data?: Record<string, string | number | boolean>) => void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

export function track<E extends keyof EventMap>(event: E, data: EventMap[E]): void {
  try {
    window.umami?.track(event, data as Record<string, string | number | boolean>);
  } catch {
    // Analytics must never break the app.
  }
}
