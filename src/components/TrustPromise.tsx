import { BadgeCheck, Infinity as InfinityIcon, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

const PROMISES = [
  { icon: BadgeCheck, text: "No ads" },
  { icon: InfinityIcon, text: "Codes never expire" },
  { icon: UserX, text: "No signup needed" },
];

export function TrustPromise({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium", className)}>
      {PROMISES.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-1.5">
          <Icon className="h-4 w-4" aria-hidden />
          {text}
        </li>
      ))}
    </ul>
  );
}
