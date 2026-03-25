import { getDateRangeForFilter } from "@/utils/date";

describe("getDateRangeForFilter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-03-17T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns null for 'all'", () => {
    expect(getDateRangeForFilter("all")).toBeNull();
  });

  it("returns today's start and end for 'today'", () => {
    const result = getDateRangeForFilter("today");
    expect(result).not.toBeNull();

    const from = new Date(result!.dateFrom);
    const to = new Date(result!.dateTo);

    const now = new Date("2026-03-17T12:00:00.000Z");
    expect(from.getFullYear()).toBe(now.getFullYear());
    expect(from.getMonth()).toBe(now.getMonth());
    expect(from.getDate()).toBe(now.getDate());
    expect(from.getHours()).toBe(0);
    expect(from.getMinutes()).toBe(0);
    expect(from.getSeconds()).toBe(0);

    expect(to.getHours()).toBe(23);
    expect(to.getMinutes()).toBe(59);
    expect(to.getSeconds()).toBe(59);
  });

  it("returns 7-day range for 'last7days'", () => {
    const result = getDateRangeForFilter("last7days");
    expect(result).not.toBeNull();

    const from = new Date(result!.dateFrom);
    const to = new Date(result!.dateTo);

    const today = new Date("2026-03-17T12:00:00.000Z");
    const expectedFrom = new Date(today);
    expectedFrom.setDate(expectedFrom.getDate() - 6);
    expectedFrom.setHours(0, 0, 0, 0);

    expect(from.getDate()).toBe(expectedFrom.getDate());
    expect(from.getMonth()).toBe(expectedFrom.getMonth());
    expect(from.getHours()).toBe(0);

    expect(to.getHours()).toBe(23);
    expect(to.getMinutes()).toBe(59);
  });

  it("returns 30-day range for 'last30days'", () => {
    const result = getDateRangeForFilter("last30days");
    expect(result).not.toBeNull();

    const from = new Date(result!.dateFrom);
    const to = new Date(result!.dateTo);

    const today = new Date("2026-03-17T12:00:00.000Z");
    const expectedFrom = new Date(today);
    expectedFrom.setDate(expectedFrom.getDate() - 29);
    expectedFrom.setHours(0, 0, 0, 0);

    expect(from.getDate()).toBe(expectedFrom.getDate());
    expect(from.getMonth()).toBe(expectedFrom.getMonth());
    expect(from.getHours()).toBe(0);

    expect(to.getHours()).toBe(23);
    expect(to.getMinutes()).toBe(59);
  });

  it("dateFrom is before dateTo for all non-null results", () => {
    const filters = ["today", "last7days", "last30days"] as const;
    for (const filter of filters) {
      const result = getDateRangeForFilter(filter);
      expect(result).not.toBeNull();
      expect(new Date(result!.dateFrom).getTime()).toBeLessThan(
        new Date(result!.dateTo).getTime(),
      );
    }
  });
});
