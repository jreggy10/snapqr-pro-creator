export const FONT_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * On phones, the share sheet offers "Save Image" to the camera roll.
 * Elsewhere, fall back to a normal download.
 */
export async function shareOrDownload(blob: Blob, filename: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], filename, { type: blob.type });
  const isTouch = window.matchMedia?.("(pointer: coarse)").matches;
  if (isTouch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return "cancelled";
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}

export function slugify(input: string, fallback = "snapqr"): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || fallback;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), type),
  );
}

/** Greedy word wrap; returns at most `maxLines`, ellipsizing the last. */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
  kept[maxLines - 1] = `${last.trimEnd()}…`;
  return kept;
}
