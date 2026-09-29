import { describe, expect, it } from "vitest";
import { DEFAULT_DESIGN } from "./defaults";
import { encodeEmail, encodeEvent, encodeSms, encodeUrl, encodeVCard, encodeWifi, wifiPasswordIssue } from "./payloads";

const vcard = DEFAULT_DESIGN.data.vcard;

describe("encodeUrl", () => {
  it("adds https when the scheme is missing", () => {
    expect(encodeUrl({ url: "thebridge.church" })).toBe("https://thebridge.church");
  });
  it("keeps existing schemes", () => {
    expect(encodeUrl({ url: "http://a.org" })).toBe("http://a.org");
    expect(encodeUrl({ url: "tel:+15551234" })).toBe("tel:+15551234");
  });
  it("is empty for blank input", () => {
    expect(encodeUrl({ url: "   " })).toBe("");
  });
});

describe("encodeWifi", () => {
  it("encodes a WPA network", () => {
    expect(encodeWifi({ ssid: "Guest", password: "pass", encryption: "WPA", hidden: false })).toBe("WIFI:T:WPA;S:Guest;P:pass;;");
  });
  it("escapes special characters", () => {
    expect(encodeWifi({ ssid: 'My;Net,"1"', password: "a:b\\c;", encryption: "WPA", hidden: true })).toBe(
      'WIFI:T:WPA;S:My\\;Net\\,\\"1\\";P:a\\:b\\\\c\\;;H:true;;',
    );
  });
  it("omits the password for open networks", () => {
    expect(encodeWifi({ ssid: "Open", password: "ignored", encryption: "nopass", hidden: false })).toBe("WIFI:T:nopass;S:Open;;");
  });
  it("is empty without an SSID", () => {
    expect(encodeWifi({ ssid: "", password: "x", encryption: "WPA", hidden: false })).toBe("");
  });
});

describe("wifiPasswordIssue", () => {
  const wifi = (password: string, encryption: "WPA" | "WEP" | "nopass" = "WPA") => ({ ssid: "Net", password, encryption, hidden: false });

  it("flags WPA passwords outside 8–63 characters", () => {
    expect(wifiPasswordIssue(wifi("short"))).toMatch(/at least 8/);
    expect(wifiPasswordIssue(wifi("x".repeat(64)))).toMatch(/at most 63/);
    expect(wifiPasswordIssue(wifi("welcome123"))).toBeNull();
    expect(wifiPasswordIssue(wifi("x".repeat(63)))).toBeNull();
  });
  it("accepts a 64-digit hex WPA key", () => {
    expect(wifiPasswordIssue(wifi("a1".repeat(32)))).toBeNull();
  });
  it("checks WEP key lengths", () => {
    expect(wifiPasswordIssue(wifi("abcde", "WEP"))).toBeNull();
    expect(wifiPasswordIssue(wifi("0123456789", "WEP"))).toBeNull();
    expect(wifiPasswordIssue(wifi("abcdef", "WEP"))).toMatch(/WEP/);
  });
  it("ignores open networks and an empty password", () => {
    expect(wifiPasswordIssue(wifi("x", "nopass"))).toBeNull();
    expect(wifiPasswordIssue(wifi(""))).toBeNull();
  });
});

describe("encodeVCard", () => {
  it("builds a vCard 3.0", () => {
    const out = encodeVCard({ ...vcard, firstName: "Ada", lastName: "Lovelace", org: "The Bridge", phone: "+1 555", website: "bridge.org" });
    expect(out.split("\n")).toEqual([
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Lovelace;Ada;;;",
      "FN:Ada Lovelace",
      "ORG:The Bridge",
      "TEL;TYPE=CELL:+1 555",
      "URL:https://bridge.org",
      "END:VCARD",
    ]);
  });
  it("escapes commas, semicolons, and newlines in the address", () => {
    const out = encodeVCard({ ...vcard, firstName: "A", street: "12 Main St, Suite 3\nRear door", city: "Austin" });
    expect(out).toContain("ADR;TYPE=WORK:;;12 Main St\\, Suite 3\\nRear door;Austin;;;");
  });
  it("is empty without a name or org", () => {
    expect(encodeVCard(vcard)).toBe("");
  });
});

describe("encodeEvent", () => {
  it("encodes an all-day event with an exclusive end date", () => {
    const out = encodeEvent({ title: "Picnic", location: "", description: "", allDay: true, start: "2026-10-04", end: "2026-10-05" });
    expect(out).toContain("DTSTART;VALUE=DATE:20261004");
    expect(out).toContain("DTEND;VALUE=DATE:20261006");
  });
  it("encodes a timed event in UTC", () => {
    const start = "2026-10-04T18:30";
    const out = encodeEvent({ title: "Night; Out", location: "Hall, B", description: "", allDay: false, start, end: "" });
    const expected = new Date(start).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    expect(out).toContain(`DTSTART:${expected}`);
    expect(out).toContain("SUMMARY:Night\\; Out");
    expect(out).toContain("LOCATION:Hall\\, B");
  });
  it("rolls an all-day event over month ends", () => {
    const out = encodeEvent({ title: "x", location: "", description: "", allDay: true, start: "2026-12-31", end: "" });
    expect(out).toContain("DTEND;VALUE=DATE:20270101");
  });
});

describe("encodeEmail / encodeSms", () => {
  it("encodes spaces as %20, not +", () => {
    expect(encodeEmail({ to: "a@b.org", subject: "Hi there", body: "" })).toBe("mailto:a@b.org?subject=Hi%20there");
  });
  it("builds SMSTO", () => {
    expect(encodeSms({ phone: " +15551234 ", message: "JOIN" })).toBe("SMSTO:+15551234:JOIN");
  });
});
