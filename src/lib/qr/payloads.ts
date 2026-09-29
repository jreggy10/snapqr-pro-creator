import type {
  EmailData,
  EventData,
  QRDataByType,
  QRType,
  SmsData,
  TextData,
  UrlData,
  VCardData,
  WifiData,
} from "./types";

const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
const WIFI_SPECIAL_RE = /([\\;,:"])/g;
const VCARD_SPECIAL_RE = /([\\;,])/g;
const NEWLINE_RE = /\r?\n/g;

export function encodeUrl({ url }: UrlData): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return SCHEME_RE.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function encodeText({ text }: TextData): string {
  return text;
}

const escapeWifi = (s: string) => s.replace(WIFI_SPECIAL_RE, "\\$1");

const HEX_RE = /^[0-9a-f]+$/i;

/**
 * Phones silently refuse to join with a malformed key, so flag it up front.
 * WPA: 8–63 character passphrase, or a 64-digit hex key.
 * WEP: 5 or 13 characters, or a 10- or 26-digit hex key.
 */
export function wifiPasswordIssue({ password, encryption }: WifiData): string | null {
  if (encryption === "nopass" || !password) return null;
  const len = password.length;
  if (encryption === "WPA") {
    if (len === 64 && HEX_RE.test(password)) return null;
    if (len < 8) return "WPA passwords are at least 8 characters. Phones won't join with a shorter one.";
    if (len > 63) return "WPA passwords are at most 63 characters.";
    return null;
  }
  if (len === 5 || len === 13) return null;
  if ((len === 10 || len === 26) && HEX_RE.test(password)) return null;
  return "WEP keys are 5 or 13 characters (or 10 or 26 hex digits).";
}

export function encodeWifi({ ssid, password, encryption, hidden }: WifiData): string {
  if (!ssid) return "";
  let out = `WIFI:T:${encryption};S:${escapeWifi(ssid)};`;
  if (encryption !== "nopass") out += `P:${escapeWifi(password)};`;
  if (hidden) out += "H:true;";
  return `${out};`;
}

const escapeVCard = (s: string) => s.replace(VCARD_SPECIAL_RE, "\\$1").replace(NEWLINE_RE, "\\n");

export function encodeVCard(d: VCardData): string {
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
  if (!fullName && !d.org) return "";

  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`N:${escapeVCard(d.lastName)};${escapeVCard(d.firstName)};;;`);
  lines.push(`FN:${escapeVCard(fullName || d.org)}`);
  if (d.org) lines.push(`ORG:${escapeVCard(d.org)}`);
  if (d.title) lines.push(`TITLE:${escapeVCard(d.title)}`);
  if (d.phone) lines.push(`TEL;TYPE=CELL:${d.phone.trim()}`);
  if (d.email) lines.push(`EMAIL:${d.email.trim()}`);
  if (d.website) lines.push(`URL:${encodeUrl({ url: d.website })}`);
  if (d.street || d.city || d.region || d.postcode || d.country) {
    const adr = ["", "", d.street, d.city, d.region, d.postcode, d.country].map(escapeVCard).join(";");
    lines.push(`ADR;TYPE=WORK:${adr}`);
  }
  lines.push("END:VCARD");
  return lines.join("\n");
}

const escapeIcs = (s: string) => s.replace(VCARD_SPECIAL_RE, "\\$1").replace(NEWLINE_RE, "\\n");

/** `2026-10-04` → `20261004` */
const icsDate = (value: string) => value.slice(0, 10).replace(/-/g, "");

/** Local `2026-10-04T18:30` → UTC `20261004T233000Z` */
function icsDateTimeUtc(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function nextDay(value: string): string {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10).replace(/-/g, "");
}

export function encodeEvent(d: EventData): string {
  if (!d.title || !d.start) return "";

  const lines = ["BEGIN:VEVENT", `SUMMARY:${escapeIcs(d.title)}`];
  if (d.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${icsDate(d.start)}`);
    // DTEND is exclusive for all-day events.
    lines.push(`DTEND;VALUE=DATE:${d.end ? nextDay(d.end) : nextDay(d.start)}`);
  } else {
    const start = icsDateTimeUtc(d.start);
    if (!start) return "";
    lines.push(`DTSTART:${start}`);
    const end = d.end ? icsDateTimeUtc(d.end) : "";
    if (end) lines.push(`DTEND:${end}`);
  }
  if (d.location) lines.push(`LOCATION:${escapeIcs(d.location)}`);
  if (d.description) lines.push(`DESCRIPTION:${escapeIcs(d.description)}`);
  lines.push("END:VEVENT");
  return lines.join("\n");
}

export function encodeEmail({ to, subject, body }: EmailData): string {
  if (!to.trim()) return "";
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${to.trim()}${query ? `?${query}` : ""}`;
}

export function encodeSms({ phone, message }: SmsData): string {
  if (!phone.trim()) return "";
  return `SMSTO:${phone.trim()}:${message}`;
}

export function encodePayload<T extends QRType>(type: T, data: QRDataByType): string {
  switch (type) {
    case "url":
      return encodeUrl(data.url);
    case "text":
      return encodeText(data.text);
    case "wifi":
      return encodeWifi(data.wifi);
    case "vcard":
      return encodeVCard(data.vcard);
    case "event":
      return encodeEvent(data.event);
    case "email":
      return encodeEmail(data.email);
    case "sms":
      return encodeSms(data.sms);
    default:
      return "";
  }
}
