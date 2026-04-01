import { getProviders, getInternetBillDetail } from "../index";
import { MOCK_PROVIDERS, INTERNET_BILL_DETAIL } from "@/mocks/data";

// MSW handlers for /api/pay-the-bill/providers and /api/pay-the-bill/internet-bill
// are registered globally via jest.setup.js → mocks/server.node.ts → mocks/handlers.ts

describe("getProviders", () => {
  it("returns all providers", async () => {
    const result = await getProviders();
    expect(result).toHaveLength(MOCK_PROVIDERS.length);
  });

  it("each provider has required fields", async () => {
    const result = await getProviders();
    for (const provider of result) {
      expect(provider).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });

  it("returns first provider matching mock data", async () => {
    const result = await getProviders();
    expect(result[0]).toMatchObject({
      id: MOCK_PROVIDERS[0].id,
      name: MOCK_PROVIDERS[0].name,
    });
  });
});

describe("getInternetBillDetail", () => {
  it("returns internet bill detail", async () => {
    const result = await getInternetBillDetail();
    expect(result).toBeDefined();
  });

  it("has all required fields", async () => {
    const result = await getInternetBillDetail();
    expect(result).toMatchObject({
      customerId: expect.any(String),
      name: expect.any(String),
      address: expect.any(String),
      phoneNumber: expect.any(String),
      code: expect.any(String),
      from: expect.any(String),
      to: expect.any(String),
      internetFee: expect.any(String),
      tax: expect.any(String),
      total: expect.any(String),
    });
  });

  it("returns data matching mock bill detail", async () => {
    const result = await getInternetBillDetail();
    expect(result.customerId).toBe(INTERNET_BILL_DETAIL.customerId);
    expect(result.name).toBe(INTERNET_BILL_DETAIL.name);
    expect(result.total).toBe(INTERNET_BILL_DETAIL.total);
  });
});
