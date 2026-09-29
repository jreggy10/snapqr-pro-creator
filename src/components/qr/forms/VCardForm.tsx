import type { VCardData } from "@/lib/qr/types";
import { Field } from "../Field";
import type { FormProps } from "./SimpleForms";

export function VCardForm({ data, onChange }: FormProps<VCardData>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field id="vc-first" label="First name" value={data.firstName} onChange={(firstName) => onChange({ firstName })} />
        <Field id="vc-last" label="Last name" value={data.lastName} onChange={(lastName) => onChange({ lastName })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field id="vc-org" label="Organization" value={data.org} onChange={(org) => onChange({ org })} />
        <Field id="vc-title" label="Role" value={data.title} onChange={(title) => onChange({ title })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field id="vc-phone" label="Phone" type="tel" inputMode="tel" value={data.phone} onChange={(phone) => onChange({ phone })} />
        <Field id="vc-email" label="Email" type="email" inputMode="email" value={data.email} onChange={(email) => onChange({ email })} />
      </div>
      <Field id="vc-web" label="Website" inputMode="url" value={data.website} onChange={(website) => onChange({ website })} />
      <Field id="vc-street" label="Street" value={data.street} onChange={(street) => onChange({ street })} />
      <div className="grid grid-cols-2 gap-3">
        <Field id="vc-city" label="City" value={data.city} onChange={(city) => onChange({ city })} />
        <Field id="vc-region" label="State / region" value={data.region} onChange={(region) => onChange({ region })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field id="vc-postcode" label="Postal code" value={data.postcode} onChange={(postcode) => onChange({ postcode })} />
        <Field id="vc-country" label="Country" value={data.country} onChange={(country) => onChange({ country })} />
      </div>
    </div>
  );
}
