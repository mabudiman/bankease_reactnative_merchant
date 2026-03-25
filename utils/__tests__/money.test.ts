import {
  convertAmountToMinorUnits,
  normalizeAmount,
  formatAmountInput,
  minorToMajor,
  formatCurrency,
} from "@/utils/money";

jest.mock("@/utils/log", () => ({
  log: jest.fn(),
}));

describe("normalizeAmount", () => {
  it("removes commas from amount string", () => {
    expect(normalizeAmount("1,000")).toBe("1000");
    expect(normalizeAmount("1,234,567.89")).toBe("1234567.89");
  });

  it("returns string unchanged when no commas", () => {
    expect(normalizeAmount("1000")).toBe("1000");
    expect(normalizeAmount("10.50")).toBe("10.50");
  });
});

describe("convertAmountToMinorUnits", () => {
  it("converts whole numbers to minor units (e.g. 10 -> 1000 pence)", () => {
    expect(convertAmountToMinorUnits("10")).toBe(1000);
    expect(convertAmountToMinorUnits("1")).toBe(100);
    expect(convertAmountToMinorUnits("0.01")).toBe(1);
  });

  it("converts decimals correctly (e.g. 10.50 -> 1050)", () => {
    expect(convertAmountToMinorUnits("10.50")).toBe(1050);
    expect(convertAmountToMinorUnits("1234.56")).toBe(123456);
  });

  it("normalizes comma-separated input before converting", () => {
    expect(convertAmountToMinorUnits("1,234.56")).toBe(123456);
  });

  it("returns 0 for empty string", () => {
    expect(convertAmountToMinorUnits("")).toBe(0);
  });

  it("returns 0 for zero or negative", () => {
    expect(convertAmountToMinorUnits("0")).toBe(0);
    expect(convertAmountToMinorUnits("-1")).toBe(0);
    expect(convertAmountToMinorUnits("-10.50")).toBe(0);
  });

  it("returns 0 for invalid input (NaN)", () => {
    expect(convertAmountToMinorUnits("abc")).toBe(0);
    expect(convertAmountToMinorUnits("..")).toBe(0);
  });

  it("rounds to nearest integer in minor units", () => {
    expect(convertAmountToMinorUnits("10.505")).toBe(1051);
    expect(convertAmountToMinorUnits("10.504")).toBe(1050);
  });
});

describe("formatAmountInput", () => {
  it("returns empty string for empty input", () => {
    expect(formatAmountInput("")).toBe("");
  });

  it("strips non-digit and non-separator characters", () => {
    expect(formatAmountInput("12abc34")).toBe("1234");
    expect(formatAmountInput("€10.50")).toBe("10.50");
  });

  it("limits decimal part to 2 digits", () => {
    expect(formatAmountInput("12.345")).toBe("12.34");
    expect(formatAmountInput("99.999")).toBe("99.99");
  });

  it("keeps one decimal separator (dot or comma)", () => {
    expect(formatAmountInput("12.3")).toBe("12.3");
    expect(formatAmountInput("12,3")).toBe("12.3");
  });

  it("uses first separator when both comma and dot present", () => {
    expect(formatAmountInput("1,234.56")).toBe("1.23");
  });

  it("allows integer-only input", () => {
    expect(formatAmountInput("100")).toBe("100");
  });
});

describe("minorToMajor", () => {
  it("divides by 100 (minor to major units)", () => {
    expect(minorToMajor(1000)).toBe(10);
    expect(minorToMajor(1050)).toBe(10.5);
    expect(minorToMajor(1)).toBe(0.01);
  });
});

describe("formatCurrency", () => {
  it("formats amount and currency with en-GB locale", () => {
    const result = formatCurrency(1000, "GBP");
    expect(result).toContain("10");
    expect(result).toMatch(/£|GBP/);
  });

  it("formats EUR correctly", () => {
    const result = formatCurrency(1050, "EUR");
    expect(result).toContain("10");
    expect(result).toMatch(/€|EUR/);
  });
});
