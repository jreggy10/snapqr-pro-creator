import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <Card className="card-shadow">
        <CardContent className="space-y-8 p-5 sm:p-6">
          <ContentPanel type={design.type} data={design.data} setType={setType} setData={setData} />
          <Separator />
          <StylePanel style={design.style} caption={design.caption} setStyle={setStyle} setCaption={setCaption} />
          <Separator />
          <CardPanel payload={livePayload} design={design} setCard={setCard} />
        </CardContent>
      </Card>

      <aside className="space-y-4 lg:sticky lg:top-6" aria-label="Preview and download">
        <Card className="card-shadow">
          <CardContent className="space-y-4 p-5">
            <QRPreview payload={livePayload} style={liveStyle} moduleCount={report.moduleCount} caption={design.caption} />
            {livePayload ? <ScanBadge report={report} checking={checking} /> : null}
            <ExportBar payload={payload} design={design} scanLevel={report.level} />
          </CardContent>
        </Card>
        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={reset}>
          <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
          Start over
        </Button>
      </aside>
    </div>
  );
};
