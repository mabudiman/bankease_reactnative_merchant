import { getExchangeRates, getInterestRates, getBranches } from "../index";
import { MOCK_EXCHANGE_RATES, MOCK_INTEREST_RATES, MOCK_BRANCHES } from "@/mocks/data";

// MSW handlers for /api/exchange-rates, /api/interest-rates, /api/branches
// are registered globally via jest.setup.js → mocks/server.node.ts → mocks/handlers.ts

describe("getExchangeRates", () => {
  it("returns all exchange rate entries", async () => {
    const rates = await getExchangeRates();
    expect(rates).toHaveLength(MOCK_EXCHANGE_RATES.length);
  });

  it("each item has required fields", async () => {
    const rates = await getExchangeRates();
    for (const rate of rates) {
      expect(rate).toMatchObject({
        id: expect.any(String),
        country: expect.any(String),
        currency: expect.any(String),
        countryCode: expect.any(String),
        buy: expect.any(Number),
        sell: expect.any(Number),
      });
    }
  });

  it("returns data matching first mock entry", async () => {
    const rates = await getExchangeRates();
    expect(rates[0]).toMatchObject({
      id: MOCK_EXCHANGE_RATES[0].id,
      country: MOCK_EXCHANGE_RATES[0].country,
      buy: MOCK_EXCHANGE_RATES[0].buy,
      sell: MOCK_EXCHANGE_RATES[0].sell,
    });
  });
});

describe("getInterestRates", () => {
  it("returns all interest rate entries", async () => {
    const rates = await getInterestRates();
    expect(rates).toHaveLength(MOCK_INTEREST_RATES.length);
  });

  it("each item has required fields", async () => {
    const rates = await getInterestRates();
    for (const rate of rates) {
      expect(rate).toMatchObject({
        id: expect.any(String),
        kind: expect.stringMatching(/^(individual|corporate)$/),
        deposit: expect.any(String),
        rate: expect.any(Number),
      });
    }
  });

  it("returns both individual and corporate kind entries", async () => {
    const rates = await getInterestRates();
    const kinds = rates.map((r) => r.kind);
    expect(kinds).toContain("individual");
    expect(kinds).toContain("corporate");
  });
});

describe("getBranches", () => {
  it("returns all branches when query is empty string", async () => {
    const branches = await getBranches("");
    expect(branches).toHaveLength(MOCK_BRANCHES.length);
  });

  it("returns filtered branches when query matches branch name", async () => {
    const branches = await getBranches("union");
    expect(branches.length).toBeGreaterThan(0);
    for (const branch of branches) {
      expect(branch.name.toLowerCase()).toContain("union");
    }
  });

  it("returns empty array when query matches nothing", async () => {
    const branches = await getBranches("zzznomatch");
    expect(branches).toHaveLength(0);
  });

  it("each item has required fields", async () => {
    const branches = await getBranches("");
    for (const branch of branches) {
      expect(branch).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        distance: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      });
    }
  });

  it("filter is case-insensitive", async () => {
    const lower = await getBranches("union");
    const upper = await getBranches("UNION");
    expect(lower).toHaveLength(upper.length);
  });
});
