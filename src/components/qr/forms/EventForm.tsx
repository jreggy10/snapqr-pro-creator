import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { EventData } from "@/lib/qr/types";
import { Field } from "../Field";
import type { FormProps } from "./SimpleForms";

export function EventForm({ data, onChange }: FormProps<EventData>) {
  const inputType = data.allDay ? "date" : "datetime-local";

  // Keep values valid for the input type when toggling all-day.
  const toggleAllDay = (allDay: boolean) =>
    onChange({
      allDay,
      start: allDay ? data.start.slice(0, 10) : data.start && `${data.start.slice(0, 10)}T09:00`,
      end: allDay ? data.end.slice(0, 10) : data.end && `${data.end.slice(0, 10)}T10:00`,
    });

  const endBeforeStart = Boolean(data.start && data.end && data.end < data.start);

  return (
    <div className="space-y-4">
      <Field id="ev-title" label="Event name" value={data.title} onChange={(title) => onChange({ title })} placeholder="Fall Outreach Night" />
      <div className="flex items-center justify-between">
        <Label htmlFor="ev-allday">All day</Label>
        <Switch id="ev-allday" checked={data.allDay} onCheckedChange={toggleAllDay} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field id="ev-start" label="Starts" type={inputType} value={data.start} onChange={(start) => onChange({ start })} />
        <Field
          id="ev-end"
          label="Ends"
          type={inputType}
          value={data.end}
          onChange={(end) => onChange({ end })}
          hint={endBeforeStart ? <span className="text-destructive">Ends before it starts.</span> : undefined}
        />
      </div>
      <Field id="ev-location" label="Location" value={data.location} onChange={(location) => onChange({ location })} />
      <Field id="ev-desc" label="Details" value={data.description} onChange={(description) => onChange({ description })} multiline />
      <p className="text-xs text-muted-foreground">Times are saved in your time zone. Phones show them in the scanner's local time.</p>
    </div>
  );
}
