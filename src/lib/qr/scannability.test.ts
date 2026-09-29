import { describe, expect, it } from "vitest";
import { DEFAULT_DESIGN } from "./defaults";
import { checkHeuristics, contrastRatio, getModuleCount, mergeDecode } from "./scannability";

const style = DEFAULT_DESIGN.style;

describe("contrastRatio", () => {
  it("matches WCAG extremes", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#777", "#777")).toBeCloseTo(1, 5);
  });
});

describe("checkHeuristics", () => {
  it("passes the default design", () => {
    expect(checkHeuristics("https://example.org", style).level).toBe("ok");
  });
  it("fails very low contrast", () => {
    expect(checkHeuristics("x", { ...style, fg: "#dddddd", bg: "#ffffff" }).level).toBe("fail");
  });
  it("warns on inverted colors", () => {
    const r = checkHeuristics("x", { ...style, fg: "#ffffff", bg: "#000000" });
    expect(r.level).toBe("warn");
  });
  it("warns on a large logo and fails one past the ECC budget", () => {
    const logo = "data:image/png;base64,";
    expect(checkHeuristics("x", { ...style, logo, logoSize: 0.45 }).level).toBe("warn");
    expect(checkHeuristics("x", { ...style, logo, logoSize: 0.6 }).level).toBe("fail");
  });
  it("fails data that can't fit", () => {
    expect(checkHeuristics("a".repeat(4000), style).level).toBe("fail");
  });
  it("counts modules for UTF-8", () => {
    expect(getModuleCount("héllo ✝", "M")).toBeGreaterThanOrEqual(21);
  });
});

describe("mergeDecode", () => {
  it("fails when no decode passes and warns on a partial pass", () => {
    const ok = checkHeuristics("x", style);
    expect(mergeDecode(ok, 0).level).toBe("fail");
    expect(mergeDecode(ok, 2).level).toBe("warn");
    expect(mergeDecode(ok, 3).level).toBe("ok");
    expect(mergeDecode(ok, null).level).toBe("ok");
  });
});
