import { memo, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { QrCode } from "lucide-react";
import { buildQROptions } from "@/lib/qr/render";
import type { QRStyle } from "@/lib/qr/types";

const PREVIEW_SIZE = 320;

interface QRPreviewProps {
  payload: string;
  style: QRStyle;
  moduleCount: number;
  caption: string;
}

/** One long-lived QRCodeStyling instance, updated in place. */
export const QRPreview = memo(function QRPreview({ payload, style, moduleCount, caption }: QRPreviewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const hasPayload = payload.length > 0 && moduleCount > 0;

  useEffect(() => {
    if (!hasPayload || !hostRef.current) return;
    const options = buildQROptions(payload, style, PREVIEW_SIZE, "svg", moduleCount);
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(hostRef.current);
    } else {
      qrRef.current.update(options);
    }
  }, [hasPayload, payload, style, moduleCount]);

  // The host div unmounts when the payload clears, so drop the instance with it.
  useEffect(() => {
    if (!hasPayload) qrRef.current = null;
  }, [hasPayload]);

  return (
    <div className="rounded-3xl bg-surface p-5 shadow-hero">
      <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl" style={{ background: hasPayload ? style.bg : undefined }}>
        {hasPayload ? (
          <div ref={hostRef} className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" role="img" aria-label="QR code preview" />
        ) : (
          <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-panel p-8 text-center text-ink-muted">
            <QrCode className="h-12 w-12 opacity-40" aria-hidden />
            Fill in the details and your code appears here.
          </div>
        )}
        {caption.trim() && hasPayload ? (
          <p className="px-4 pb-4 text-center text-base font-semibold" style={{ color: style.fg }}>
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  );
});
