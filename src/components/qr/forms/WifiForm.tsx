import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { wifiPasswordIssue } from "@/lib/qr/payloads";
import type { WifiData } from "@/lib/qr/types";
import { Field } from "../Field";
import type { FormProps } from "./SimpleForms";

export function WifiForm({ data, onChange }: FormProps<WifiData>) {
  const passwordIssue = wifiPasswordIssue(data);

  return (
    <div className="space-y-4">
      <Field id="wifi-ssid" label="Network name (SSID)" value={data.ssid} onChange={(ssid) => onChange({ ssid })} placeholder="Bridge-Guest" />
      <div className="space-y-1.5">
        <Label>Security</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          className="justify-start"
          value={data.encryption}
          onValueChange={(v) => v && onChange({ encryption: v as WifiData["encryption"] })}
        >
          <ToggleGroupItem value="WPA">WPA/WPA2/WPA3</ToggleGroupItem>
          <ToggleGroupItem value="WEP">WEP</ToggleGroupItem>
          <ToggleGroupItem value="nopass">None</ToggleGroupItem>
        </ToggleGroup>
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
