import { memo, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import type { CornerDotType, CornerSquareType, DotType } from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { QRDesignActions } from "@/hooks/use-qr-design";
import { readLogoFile } from "@/lib/qr/logo";
import type { QRStyle } from "@/lib/qr/types";
import { cn } from "@/lib/utils";

const DOT_STYLES: { value: DotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Soft" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy round" },
];

const CORNER_SQUARE_STYLES: { value: CornerSquareType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Circle" },
];

const CORNER_DOT_STYLES: { value: CornerDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Circle" },
];

const PRESETS: { name: string; swatch: [string, string]; style: Partial<QRStyle> }[] = [
  { name: "Classic", swatch: ["#111111", "#ffffff"], style: { fg: "#111111", bg: "#ffffff", dotStyle: "square", cornerSquareStyle: "square", cornerDotStyle: "square" } },
  { name: "Friendly", swatch: ["#1e3a8a", "#ffffff"], style: { fg: "#1e3a8a", bg: "#ffffff", dotStyle: "rounded", cornerSquareStyle: "extra-rounded", cornerDotStyle: "dot" } },
  { name: "Dots", swatch: ["#0f172a", "#f8fafc"], style: { fg: "#0f172a", bg: "#f8fafc", dotStyle: "dots", cornerSquareStyle: "dot", cornerDotStyle: "dot" } },
  { name: "Warm", swatch: ["#7c2d12", "#fff7ed"], style: { fg: "#7c2d12", bg: "#fff7ed", dotStyle: "classy-rounded", cornerSquareStyle: "extra-rounded", cornerDotStyle: "square" } },
  { name: "Forest", swatch: ["#14532d", "#f0fdf4"], style: { fg: "#14532d", bg: "#f0fdf4", dotStyle: "extra-rounded", cornerSquareStyle: "extra-rounded", cornerDotStyle: "dot" } },
];

interface ChoiceRowProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function ChoiceRow<T extends string>({ label, options, value, onChange }: ChoiceRowProps<T>) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === o.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const HEX6_RE = /^#[0-9a-f]{6}$/i;

function ColorField({ id, label, value, onChange }: ColorFieldProps) {
  // Local draft so partial hex while typing never reaches the renderer.
  const [draft, setDraft] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value);
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 shrink-0 cursor-pointer rounded border border-input bg-transparent"
        />
        <Input
          aria-label={`${label} hex`}
          value={draft}
          onChange={(e) => {
            const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            setDraft(next);
            if (HEX6_RE.test(next)) onChange(next.toLowerCase());
          }}
          onBlur={() => setDraft(value)}
          className="h-9 font-mono text-xs"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

interface StylePanelProps {
  style: QRStyle;
  caption: string;
  setStyle: QRDesignActions["setStyle"];
  setCaption: QRDesignActions["setCaption"];
}

export const StylePanel = memo(function StylePanel({ style, caption, setStyle, setCaption }: StylePanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setStyle({ logo: await readLogoFile(file) });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <section aria-labelledby="style-heading" className="space-y-5">
      <h2 id="style-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        2. Make it yours
      </h2>

      <div className="space-y-1.5">
        <span className="text-sm font-medium">Quick styles</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setStyle(p.style)}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-4 w-4 overflow-hidden rounded-full border border-border" aria-hidden>
                <span className="h-full w-1/2" style={{ background: p.swatch[0] }} />
                <span className="h-full w-1/2" style={{ background: p.swatch[1] }} />
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ColorField id="fg" label="Code color" value={style.fg} onChange={(fg) => setStyle({ fg })} />
        <ColorField id="bg" label="Background" value={style.bg} onChange={(bg) => setStyle({ bg })} />
      </div>

      <ChoiceRow label="Dots" options={DOT_STYLES} value={style.dotStyle} onChange={(dotStyle) => setStyle({ dotStyle })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceRow label="Corner frames" options={CORNER_SQUARE_STYLES} value={style.cornerSquareStyle} onChange={(cornerSquareStyle) => setStyle({ cornerSquareStyle })} />
        <ChoiceRow label="Corner centers" options={CORNER_DOT_STYLES} value={style.cornerDotStyle} onChange={(cornerDotStyle) => setStyle({ cornerDotStyle })} />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Logo</span>
        <div className="flex items-center gap-3">
          {style.logo ? (
            <>
              <img src={style.logo} alt="Uploaded logo" className="h-12 w-12 rounded border border-border bg-white object-contain p-1" />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setStyle({ logo: null })}>
                <X className="mr-1 h-4 w-4" aria-hidden />
                Remove
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="mr-2 h-4 w-4" aria-hidden />
              Upload logo
            </Button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
        </div>
        {style.logo ? (
          <div className="space-y-1.5 pt-1">
            <Label>Logo size: {Math.round(style.logoSize * 100)}%</Label>
            <Slider value={[style.logoSize]} min={0.1} max={0.5} step={0.01} onValueChange={([logoSize]) => setStyle({ logoSize })} />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">Your logo stays on your device. Nothing is uploaded.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="caption">Caption under the code</Label>
        <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Scan to join our WiFi" />
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="advanced" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm">Advanced</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Quiet zone: {style.margin} modules</Label>
              <Slider value={[style.margin]} min={0} max={8} step={1} onValueChange={([margin]) => setStyle({ margin })} />
            </div>
            <div className="space-y-1.5">
              <Label>PNG size: {style.size}px</Label>
              <Slider value={[style.size]} min={256} max={4096} step={64} onValueChange={([size]) => setStyle({ size })} />
            </div>
            <ChoiceRow
              label={style.logo ? "Error correction (locked to High with a logo)" : "Error correction"}
              options={[
                { value: "L", label: "Low 7%" },
                { value: "M", label: "Medium 15%" },
                { value: "Q", label: "Quartile 25%" },
                { value: "H", label: "High 30%" },
              ]}
              value={style.logo ? "H" : style.ecc}
              onChange={(ecc) => setStyle({ ecc })}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
});
