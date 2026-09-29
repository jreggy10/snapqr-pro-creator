import { useEffect, useMemo, useState } from "react";
import { checkHeuristics, decodeSizes, mergeDecode, verifyDecode, type ScanReport } from "@/lib/qr/scannability";
import { renderPng } from "@/lib/qr/instance";
import type { QRStyle } from "@/lib/qr/types";

/** Instant heuristics plus a debounced real decode of the rendered design. */
export function useScannability(payload: string, style: QRStyle) {
  const heuristics = useMemo(() => checkHeuristics(payload, style), [payload, style]);
  const [decode, setDecode] = useState<{ key: string; passed: number } | null>(null);

  // Only visual inputs matter for the decode; size is export-only.
  const { fg, bg, dotStyle, cornerSquareStyle, cornerDotStyle, logo, logoSize, margin, ecc } = style;
  const decodeKey = JSON.stringify([payload, fg, bg, dotStyle, cornerSquareStyle, cornerDotStyle, logo?.length, logoSize, margin, ecc]);

  useEffect(() => {
    if (!payload || !heuristics.moduleCount) return;
    let cancelled = false;
    const id = setTimeout(async () => {
      try {
        let passed = 0;
        for (const size of decodeSizes(heuristics.moduleCount, style.margin)) {
          if (cancelled) return;
          if (await verifyDecode(await renderPng(payload, style, size), payload)) passed++;
        }
        if (!cancelled) setDecode({ key: decodeKey, passed });
      } catch {
        // Rendering hiccup: keep heuristics only.
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
    // decodeKey captures every input the decode depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodeKey]);

  const fresh = decode?.key === decodeKey;
  const report: ScanReport = mergeDecode(heuristics, fresh ? decode.passed : null);
  return { report, checking: Boolean(payload) && heuristics.moduleCount > 0 && !fresh };
}
