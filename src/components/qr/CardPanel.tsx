import { memo, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { QRDesignActions } from "@/hooks/use-qr-design";
import type { CardTheme, QRDesign } from "@/lib/qr/types";
import { cn } from "@/lib/utils";

const THEMES: { value: CardTheme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "brand", label: "Code color" },
];

interface CardPanelProps {
  payload: string;
  design: QRDesign;
  setCard: QRDesignActions["setCard"];
}

/** Title, subtitle, and theme for the 1080×1920 phone card, plus a live thumbnail. */
export const CardPanel = memo(function CardPanel({ payload, design, setCard }: CardPanelProps) {
  const { card } = design;
  const debounced = useDebouncedValue(design, 500);
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!payload) {
      setThumb(null);
      return;
    }
    let cancelled = false;
    let url: string | null = null;
    import("@/lib/export/card")
      .then(({ exportCard }) => exportCard(payload, debounced))
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setThumb(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [payload, debounced]);

  return (
    <section aria-labelledby="card-heading" className="space-y-4">
      <h2 id="card-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        3. Phone card <span className="font-normal normal-case tracking-normal">(optional)</span>
      </h2>
      <p className="text-sm text-muted-foreground">
        A full-screen image to save to your camera roll and hold up for people to scan at the door, the welcome table, or the lobby.
      </p>
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="card-title">Headline</Label>
            <Input id="card-title" value={card.title} onChange={(e) => setCard({ title: e.target.value })} placeholder="Guest WiFi" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-subtitle">Subtext</Label>
            <Input id="card-subtitle" value={card.subtitle} onChange={(e) => setCard({ subtitle: e.target.value })} placeholder="Welcome! Scan to connect." />
          </div>
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-medium">Card theme</legend>
            <div className="flex gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={card.theme === t.value}
                  onClick={() => setCard({ theme: t.value })}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    card.theme === t.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="mx-auto aspect-[9/16] w-[120px] overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
          {thumb ? <img src={thumb} alt="Phone card preview" className="h-full w-full object-cover" /> : null}
        </div>
      </div>
    </section>
  );
});
