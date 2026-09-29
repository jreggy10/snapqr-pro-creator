import type { EmailData, SmsData, TextData, UrlData } from "@/lib/qr/types";
import { Field } from "../Field";

interface FormProps<T> {
  data: T;
  onChange: (patch: Partial<T>) => void;
}

export function UrlForm({ data, onChange }: FormProps<UrlData>) {
  return (
    <Field
      id="url"
      label="Website or link"
      value={data.url}
      onChange={(url) => onChange({ url })}
      placeholder="thebridge.church/events"
      inputMode="url"
      hint="We'll add https:// if you leave it off."
    />
  );
}

export function TextForm({ data, onChange }: FormProps<TextData>) {
  return (
    <Field id="text" label="Text" value={data.text} onChange={(text) => onChange({ text })} placeholder="Any message…" multiline />
  );
}

export function EmailForm({ data, onChange }: FormProps<EmailData>) {
  return (
    <div className="space-y-4">
      <Field id="email-to" label="Send to" type="email" inputMode="email" value={data.to} onChange={(to) => onChange({ to })} placeholder="hello@example.org" />
      <Field id="email-subject" label="Subject" value={data.subject} onChange={(subject) => onChange({ subject })} placeholder="Prayer request" />
      <Field id="email-body" label="Message" value={data.body} onChange={(body) => onChange({ body })} multiline />
    </div>
  );
}

export function SmsForm({ data, onChange }: FormProps<SmsData>) {
  return (
    <div className="space-y-4">
      <Field id="sms-phone" label="Phone number" type="tel" inputMode="tel" value={data.phone} onChange={(phone) => onChange({ phone })} placeholder="+1 555 123 4567" />
      <Field id="sms-message" label="Pre-filled message" value={data.message} onChange={(message) => onChange({ message })} placeholder="JOIN" multiline />
    </div>
  );
}

export type { FormProps };
