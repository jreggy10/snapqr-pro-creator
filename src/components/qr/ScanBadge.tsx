import { memo } from "react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { ScanReport } from "@/lib/qr/scannability";
import { cn } from "@/lib/utils";

const COPY = {
  ok: { label: "Scans well", icon: CheckCircle2, className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  warn: { label: "May be hard to scan", icon: AlertTriangle, className: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300" },
  fail: { label: "Won't scan reliably", icon: XCircle, className: "border-destructive/40 bg-destructive/10 text-destructive" },
} as const;

interface ScanBadgeProps {
  report: ScanReport;
  checking: boolean;
}

export const ScanBadge = memo(function ScanBadge({ report, checking }: ScanBadgeProps) {
  const { label, icon: Icon, className } = COPY[report.level];
  return (
    <div className={cn("rounded-lg border px-3 py-2.5 text-sm", className)} role="status" aria-live="polite">
      <div className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {label}
        {checking ? <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin opacity-60" aria-label="Checking" /> : null}
      </div>
      {report.issues.length ? (
        <ul className="mt-1.5 space-y-1 pl-6 text-xs opacity-90">
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
