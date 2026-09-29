import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel } from "qr-code-styling";

export type QRType = "url" | "text" | "wifi" | "vcard" | "event" | "email" | "sms";

export interface UrlData {
  url: string;
}

export interface TextData {
  text: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  org: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
}

export interface EventData {
  title: string;
  location: string;
  description: string;
  allDay: boolean;
  /** `YYYY-MM-DDTHH:mm` (datetime-local) or `YYYY-MM-DD` when allDay */
  start: string;
  end: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface QRDataByType {
  url: UrlData;
  text: TextData;
  wifi: WifiData;
  vcard: VCardData;
  event: EventData;
  email: EmailData;
  sms: SmsData;
}

export interface QRStyle {
  fg: string;
  bg: string;
  dotStyle: DotType;
  cornerSquareStyle: CornerSquareType;
  cornerDotStyle: CornerDotType;
  /** data URL, downscaled on upload */
  logo: string | null;
  /** fraction of QR width, 0.1–0.4 */
  logoSize: number;
  /** quiet zone in modules */
  margin: number;
  ecc: ErrorCorrectionLevel;
  /** PNG export width in px */
  size: number;
}

export type CardTheme = "light" | "dark" | "brand";

export interface CardSettings {
  title: string;
  subtitle: string;
  theme: CardTheme;
}

/** The whole design. Phase 2 saved library + brand kits persist this object. */
export interface QRDesign {
  version: 1;
  type: QRType;
  data: QRDataByType;
  style: QRStyle;
  caption: string;
  card: CardSettings;
}
