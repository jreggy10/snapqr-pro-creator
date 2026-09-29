import { memo } from "react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { ScanReport } from "@/lib/qr/scannability";
import { cn } from "@/lib/utils";

const COPY = {
  ok: { label: "Scans well", icon: CheckCircle2, className: "bg-recovery-green/10", iconClass: "text-recovery-green" },
  warn: { label: "May be hard to scan", icon: AlertTriangle, className: "bg-amber-400/15", iconClass: "text-amber-500" },
  fail: { label: "Won't scan reliably", icon: XCircle, className: "bg-destructive/10", iconClass: "text-destructive" },
} as const;

interface ScanBadgeProps {
  report: ScanReport;
  checking: boolean;
}

export const ScanBadge = memo(function ScanBadge({ report, checking }: ScanBadgeProps) {
  const { label, icon: Icon, className, iconClass } = COPY[report.level];
  return (
    <div className={cn("rounded-2xl px-4 py-3 text-sm text-ink", className)} role="status" aria-live="polite">
      <div className="flex items-center gap-2 font-medium">
        <Icon className={cn("h-4 w-4 shrink-0", iconClass)} aria-hidden />
        {label}
        {checking ? <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin opacity-60" aria-label="Checking" /> : null}
      </div>
      {report.issues.length ? (
        <ul className="mt-1.5 space-y-1 pl-6 text-[13px] text-body-gray">
          {report.issues.map((issue) => (
            <li key={issue.message} className="list-disc">
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
