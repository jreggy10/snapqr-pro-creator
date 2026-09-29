import { memo } from "react";
import { CalendarDays, Contact, Link2, Mail, MessageSquare, Type, Wifi, type LucideIcon } from "lucide-react";
import type { QRDesignActions } from "@/hooks/use-qr-design";
import type { QRDataByType, QRType } from "@/lib/qr/types";
import { cn } from "@/lib/utils";
import { EmailForm, SmsForm, TextForm, UrlForm } from "./forms/SimpleForms";
import { WifiForm } from "./forms/WifiForm";
import { VCardForm } from "./forms/VCardForm";
import { EventForm } from "./forms/EventForm";

const TYPES: { value: QRType; label: string; icon: LucideIcon }[] = [
  { value: "url", label: "Link", icon: Link2 },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "vcard", label: "Contact", icon: Contact },
  { value: "event", label: "Event", icon: CalendarDays },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "text", label: "Text", icon: Type },
];

interface ContentPanelProps {
  type: QRType;
  data: QRDataByType;
  setType: QRDesignActions["setType"];
  setData: QRDesignActions["setData"];
}

export const ContentPanel = memo(function ContentPanel({ type, data, setType, setData }: ContentPanelProps) {
  return (
    <section aria-labelledby="content-heading" className="space-y-4">
      <h2 id="content-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        1. What should it open?
      </h2>
      <div role="tablist" aria-label="QR code type" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={type === value}
            onClick={() => setType(value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              type === value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {type === "url" ? <UrlForm data={data.url} onChange={(p) => setData("url", p)} /> : null}
        {type === "text" ? <TextForm data={data.text} onChange={(p) => setData("text", p)} /> : null}
        {type === "wifi" ? <WifiForm data={data.wifi} onChange={(p) => setData("wifi", p)} /> : null}
        {type === "vcard" ? <VCardForm data={data.vcard} onChange={(p) => setData("vcard", p)} /> : null}
        {type === "event" ? <EventForm data={data.event} onChange={(p) => setData("event", p)} /> : null}
        {type === "email" ? <EmailForm data={data.email} onChange={(p) => setData("email", p)} /> : null}
        {type === "sms" ? <SmsForm data={data.sms} onChange={(p) => setData("sms", p)} /> : null}
      </div>
    </section>
  );
});
