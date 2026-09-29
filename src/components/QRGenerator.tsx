import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useQRDesign } from "@/hooks/use-qr-design";
import { useScannability } from "@/hooks/use-scannability";
import { encodePayload } from "@/lib/qr/payloads";
import { ContentPanel } from "./qr/ContentPanel";
import { StylePanel } from "./qr/StylePanel";
import { CardPanel } from "./qr/CardPanel";
import { QRPreview } from "./qr/QRPreview";
import { ScanBadge } from "./qr/ScanBadge";
import { ExportBar } from "./qr/ExportBar";

export const QRGenerator = () => {
  const { design, setType, setData, setStyle, setCaption, setCard, reset } = useQRDesign();

  const payload = useMemo(() => encodePayload(design.type, design.data), [design.type, design.data]);
  // Typing stays snappy; the renderer catches up.
  const livePayload = useDebouncedValue(payload, 150);
  const liveStyle = useDebouncedValue(design.style, 150);
  const { report, checking } = useScannability(livePayload, liveStyle);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="space-y-10">
        <ContentPanel type={design.type} data={design.data} setType={setType} setData={setData} />
        <StylePanel style={design.style} caption={design.caption} setStyle={setStyle} setCaption={setCaption} />
        <CardPanel payload={livePayload} design={design} setCard={setCard} />
      </div>

      {/* Sticky only when the whole column fits, so downloads never get stranded below the fold. */}
      <aside className="space-y-5 lg:[@media(min-height:760px)]:sticky lg:[@media(min-height:760px)]:top-8" aria-label="Preview and download">
        <QRPreview payload={livePayload} style={liveStyle} moduleCount={report.moduleCount} caption={design.caption} />
        {livePayload ? <ScanBadge report={report} checking={checking} /> : null}
        <ExportBar payload={payload} design={design} scanLevel={report.level} />
        <Button variant="ghost" size="sm" className="w-full rounded-full text-body-gray" onClick={reset}>
          <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
          Start over
        </Button>
      </aside>
    </div>
  );
};
