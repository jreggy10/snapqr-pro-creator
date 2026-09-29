import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./analytics";

const g = globalThis as { window?: unknown };

describe("track", () => {
  afterEach(() => {
    delete g.window;
  });

  it("forwards the event and its labels to Umami", () => {
    const umami = { track: vi.fn() };
    g.window = { umami };
    track("export", { format: "png", type: "wifi", scan: "ok", logo: false });
    expect(umami.track).toHaveBeenCalledWith("export", { format: "png", type: "wifi", scan: "ok", logo: false });
  });

  it("does nothing when the script is blocked or not loaded", () => {
    g.window = {};
    expect(() => track("qr-type", { type: "url" })).not.toThrow();
  });

  it("never throws, even if Umami does", () => {
    g.window = {
      umami: {
        track: () => {
          throw new Error("boom");
        },
      },
    };
    expect(() => track("preset", { name: "Classic" })).not.toThrow();
  });
});
