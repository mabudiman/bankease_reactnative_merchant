import { convertAmount, formatResult, RATES, CURRENCIES } from "../currency";
import { CURRENCY_LIST } from "@/mocks/data";

// CURRENCY_LIST from mocks/data:
// { code: 'USD', rate: 1 }, { code: 'IDR', rate: 16350 },
// { code: 'EUR', rate: 0.92 }, { code: 'JPY', rate: 149.5 }, etc.

describe("RATES", () => {
  it("builds a rate map from CURRENCY_LIST", () => {
    for (const entry of CURRENCY_LIST) {
      expect(RATES[entry.code]).toBe(entry.rate);
    }
  });

  it("contains USD with rate 1", () => {
    expect(RATES["USD"]).toBe(1);
  });
});

describe("CURRENCIES", () => {
  it("contains all currency codes from CURRENCY_LIST", () => {
    for (const entry of CURRENCY_LIST) {
      expect(CURRENCIES).toContain(entry.code);
    }
  });

  it("is sorted alphabetically", () => {
    const sorted = [...CURRENCIES].sort();
    expect(CURRENCIES).toEqual(sorted);
  });

  it("has the same length as CURRENCY_LIST", () => {
    expect(CURRENCIES).toHaveLength(CURRENCY_LIST.length);
  });
});

describe("convertAmount", () => {
  it("returns same amount when converting USD to USD", () => {
    const result = convertAmount(100, "USD", "USD");
    expect(result).toBeCloseTo(100, 5);
  });

  it("converts USD to IDR correctly", () => {
    const expected = 100 * RATES["IDR"]; // 100 / 1 * 16350
    const result = convertAmount(100, "USD", "IDR");
    expect(result).toBeCloseTo(expected, 2);
  });

  it("converts IDR to USD correctly", () => {
    const expected = 16350 / RATES["IDR"]; // 1 USD
    const result = convertAmount(16350, "IDR", "USD");
    expect(result).toBeCloseTo(expected, 5);
  });

  it("converts EUR to JPY via USD as pivot", () => {
    // EUR → USD → JPY: (1 / 0.92) * 149.5
    const expected = (1 / RATES["EUR"]) * RATES["JPY"];
    const result = convertAmount(1, "EUR", "JPY");
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns 0 when amount is 0", () => {
    const result = convertAmount(0, "USD", "IDR");
    expect(result).toBe(0);
  });

  it("handles large amounts without overflow", () => {
    const result = convertAmount(1_000_000, "USD", "IDR");
    expect(result).toBeCloseTo(1_000_000 * RATES["IDR"], -1);
  });
});

describe("formatResult", () => {
  it("formats integer values with thousand separators", () => {
    expect(formatResult(1000)).toBe("1,000");
  });

  it("formats large numbers with correct separators", () => {
    expect(formatResult(1_635_000)).toBe("1,635,000");
  });

  it("formats decimal values up to 2 decimal places", () => {
    expect(formatResult(1.5)).toBe("1.5");
    expect(formatResult(1.25)).toBe("1.25");
  });

  it("trims trailing zeros beyond 2 decimal places", () => {
    expect(formatResult(1.0)).toBe("1");
  });

  it("rounds to maximum 2 decimal places", () => {
    // 1/3 ≈ 0.333... → formatted as '0.33'
    const result = formatResult(1 / 3);
    expect(result).toBe("0.33");
  });

  it('formats zero as "0"', () => {
    expect(formatResult(0)).toBe("0");
  });

  it("formats fractional-only value correctly", () => {
    expect(formatResult(0.9)).toBe("0.9");
  });
});
