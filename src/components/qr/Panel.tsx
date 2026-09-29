import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  step: number;
  title: string;
  titleId: string;
  aside?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Step panel: panel fill, generous radius and padding, no border or shadow. */
export function Panel({ step, title, titleId, aside, description, children, className }: PanelProps) {
  return (
    <section aria-labelledby={titleId} className={cn("rounded-[28px] bg-panel p-6 sm:p-8", className)}>
      <header className="mb-6 space-y-1.5">
        <h2 id={titleId} className="flex items-baseline gap-3 text-2xl font-semibold text-ink">
          <span className="text-base font-medium text-ink-muted">{step}</span>
          {title}
          {aside ? <span className="text-base font-normal tracking-normal text-ink-muted">{aside}</span> : null}
        </h2>
        {description ? <p className="text-base text-ink-muted">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

interface PillOptionProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

/** Segmented-control option: surface pill, action-filled when active. */
export function PillOption({ active, onClick, children, className }: PillOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
        active ? "bg-action text-action-foreground" : "bg-surface text-ink-muted hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
