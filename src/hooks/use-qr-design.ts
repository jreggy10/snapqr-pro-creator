import { useCallback, useEffect, useState } from "react";
import { DEFAULT_DESIGN } from "@/lib/qr/defaults";
import type { CardSettings, QRDataByType, QRDesign, QRStyle, QRType } from "@/lib/qr/types";

const STORAGE_KEY = "snapqr:design:v1";

/** Merge a stored design over defaults so new fields always exist. */
function loadDesign(): QRDesign {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DESIGN;
    const saved = JSON.parse(raw) as Partial<QRDesign>;
    if (saved.version !== 1) return DEFAULT_DESIGN;
    const data = { ...DEFAULT_DESIGN.data } as QRDataByType;
    for (const key of Object.keys(data) as QRType[]) {
      data[key] = { ...DEFAULT_DESIGN.data[key], ...saved.data?.[key] } as never;
    }
    return {
      ...DEFAULT_DESIGN,
      ...saved,
      data,
      style: { ...DEFAULT_DESIGN.style, ...saved.style },
      card: { ...DEFAULT_DESIGN.card, ...saved.card },
    };
  } catch {
    return DEFAULT_DESIGN;
  }
}

export function useQRDesign() {
  const [design, setDesign] = useState<QRDesign>(loadDesign);

  // Persist after edits settle; a logo data URL can be large.
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
      } catch {
        // Storage full or blocked: the session still works.
      }
    }, 400);
    return () => clearTimeout(id);
  }, [design]);

  const setType = useCallback((type: QRType) => setDesign((d) => ({ ...d, type })), []);

  const setData = useCallback(<T extends QRType>(type: T, patch: Partial<QRDataByType[T]>) => {
    setDesign((d) => ({ ...d, data: { ...d.data, [type]: { ...d.data[type], ...patch } } }));
  }, []);

  const setStyle = useCallback((patch: Partial<QRStyle>) => {
    setDesign((d) => ({ ...d, style: { ...d.style, ...patch } }));
  }, []);

  const setCaption = useCallback((caption: string) => setDesign((d) => ({ ...d, caption })), []);

  const setCard = useCallback((patch: Partial<CardSettings>) => {
    setDesign((d) => ({ ...d, card: { ...d.card, ...patch } }));
  }, []);

  const reset = useCallback(() => setDesign(DEFAULT_DESIGN), []);

  return { design, setType, setData, setStyle, setCaption, setCard, reset };
}

export type QRDesignActions = Omit<ReturnType<typeof useQRDesign>, "design">;
