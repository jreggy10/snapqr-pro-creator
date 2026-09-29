import { memo, useState } from "react";
import { ChevronDown, Copy, Download, FileText, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { QRDesign } from "@/lib/qr/types";
import type { ScanLevel } from "@/lib/qr/scannability";
import { downloadBlob, shareOrDownload, slugify } from "@/lib/export/files";
import type { PdfPreset } from "@/lib/export/pdf";

type Job = "png" | "svg" | "pdf" | "card" | "copy";

const PDF_OPTIONS: { value: PdfPreset; label: string }[] = [
  { value: "letter", label: "US Letter" },
  { value: "a4", label: "A4" },
  { value: "sign4x6", label: "4×6 sign" },
];

interface ExportBarProps {
  payload: string;
  design: QRDesign;
  scanLevel: ScanLevel;
}

export const ExportBar = memo(function ExportBar({ payload, design, scanLevel }: ExportBarProps) {
  const [busy, setBusy] = useState<Job | null>(null);
  const disabled = !payload || busy !== null;
  const base = slugify(design.card.title || design.caption || `${design.type}-qr`);

  const run = async (job: Job, task: () => Promise<string | void>) => {
    if (scanLevel === "fail") toast.warning("Heads up: this design may not scan. Test it before printing.");
    setBusy(job);
    try {
      const message = await task();
      if (message) toast.success(message);
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const png = () =>
    run("png", async () => {
      const { exportPng } = await import("@/lib/export/image");
      downloadBlob(await exportPng(payload, design), `${base}.png`);
      return "PNG downloaded";
    });

  const svg = () =>
    run("svg", async () => {
      const { exportSvgText } = await import("@/lib/export/image");
      const text = await exportSvgText(payload, design);
      downloadBlob(new Blob([text], { type: "image/svg+xml" }), `${base}.svg`);
      return "SVG downloaded";
    });

  const pdf = (preset: PdfPreset) =>
    run("pdf", async () => {
      const { exportPdf } = await import("@/lib/export/pdf");
      downloadBlob(await exportPdf(payload, design, preset), `${base}.pdf`);
      return "PDF downloaded";
    });

  const card = () =>
    run("card", async () => {
      const { exportCard } = await import("@/lib/export/card");
      const result = await shareOrDownload(await exportCard(payload, design), `${base}-card.png`);
      return result === "downloaded" ? "Phone card downloaded" : undefined;
    });

  const copy = () =>
    run("copy", async () => {
      const { exportPng } = await import("@/lib/export/image");
      // Pass a promise so Safari keeps the user-gesture context.
      await navigator.clipboard.write([new ClipboardItem({ "image/png": exportPng(payload, design) })]);
      return "Copied to clipboard";
    });

  const icon = (job: Job, Idle: typeof Download) =>
    busy === job ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <Idle className="mr-2 h-4 w-4" aria-hidden />;

  const segment =
    "h-10 flex-1 rounded-full px-3 text-sm font-medium text-ink hover:bg-paper disabled:text-body-gray disabled:hover:bg-transparent";

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Download" className="flex items-center gap-1 rounded-full bg-cloud p-1">
        <Button onClick={png} disabled={disabled} variant="ghost" className={segment}>
          {icon("png", Download)}PNG
        </Button>
        <Button onClick={svg} disabled={disabled} variant="ghost" className={segment}>
          {icon("svg", Download)}SVG
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={disabled} variant="ghost" className={segment}>
              {icon("pdf", FileText)}PDF
              <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-60" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-1.5">
            {PDF_OPTIONS.map((o) => (
              <DropdownMenuItem key={o.value} className="rounded-xl" onSelect={() => pdf(o.value)}>
                {o.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={card} disabled={disabled} className="h-12 flex-1 rounded-full bg-charcoal text-base text-cloud hover:bg-charcoal/90">
          {icon("card", Smartphone)}Save phone card
        </Button>
        <Button
          onClick={copy}
          disabled={disabled}
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-cloud text-ink hover:bg-cloud/70"
          aria-label="Copy PNG to clipboard"
        >
          {busy === "copy" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );
});
