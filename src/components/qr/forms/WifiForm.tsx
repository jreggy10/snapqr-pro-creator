import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { wifiPasswordIssue } from "@/lib/qr/payloads";
import type { WifiData } from "@/lib/qr/types";
import { Field } from "../Field";
import type { FormProps } from "./SimpleForms";
import { PillOption } from "../Panel";

const SECURITY: { value: WifiData["encryption"]; label: string }[] = [
  { value: "WPA", label: "WPA/WPA2/WPA3" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "None" },
];

export function WifiForm({ data, onChange }: FormProps<WifiData>) {
  const passwordIssue = wifiPasswordIssue(data);

  return (
    <div className="space-y-4">
      <Field id="wifi-ssid" label="Network name (SSID)" value={data.ssid} onChange={(ssid) => onChange({ ssid })} placeholder="Bridge-Guest" />
      <div className="space-y-2">
        <Label>Security</Label>
        <div className="flex flex-wrap gap-1.5">
          {SECURITY.map((o) => (
            <PillOption key={o.value} active={data.encryption === o.value} onClick={() => onChange({ encryption: o.value })}>
              {o.label}
            </PillOption>
          ))}
        </div>
      </div>
      {data.encryption !== "nopass" ? (
        <Field
          id="wifi-password"
          label="Password"
          value={data.password}
          onChange={(password) => onChange({ password })}
          hint={passwordIssue ? <span className="text-destructive">{passwordIssue}</span> : undefined}
        />
      ) : null}
      <div className="flex items-center justify-between">
        <Label htmlFor="wifi-hidden">Hidden network</Label>
        <Switch id="wifi-hidden" checked={data.hidden} onCheckedChange={(hidden) => onChange({ hidden })} />
      </div>
    </div>
  );
}
