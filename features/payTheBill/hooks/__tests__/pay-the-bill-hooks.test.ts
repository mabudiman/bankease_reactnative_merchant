import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/test-utils/createWrapper";
import { useProviders, useInternetBillDetail } from "../index";
import { MOCK_PROVIDERS, INTERNET_BILL_DETAIL } from "@/mocks/data";

// MSW handlers for /api/pay-the-bill/providers and /api/pay-the-bill/internet-bill
// are registered globally via jest.setup.js → mocks/server.node.ts → mocks/handlers.ts

describe("useProviders", () => {
  it("starts in loading state", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProviders(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("fetches all providers successfully", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProviders(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(MOCK_PROVIDERS.length);
  });

  it("each provider has id and name", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProviders(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    for (const provider of result.current.data!) {
      expect(provider).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });

  it("returns first provider matching mock data", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProviders(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data![0].id).toBe(MOCK_PROVIDERS[0].id);
    expect(result.current.data![0].name).toBe(MOCK_PROVIDERS[0].name);
  });
});

describe("useInternetBillDetail", () => {
  it("starts in loading state", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInternetBillDetail(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("fetches internet bill detail successfully", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInternetBillDetail(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it("returns bill detail matching mock data", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInternetBillDetail(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data!.customerId).toBe(INTERNET_BILL_DETAIL.customerId);
    expect(result.current.data!.name).toBe(INTERNET_BILL_DETAIL.name);
    expect(result.current.data!.total).toBe(INTERNET_BILL_DETAIL.total);
  });

  it("has all required bill detail fields", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInternetBillDetail(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      customerId: expect.any(String),
      name: expect.any(String),
      internetFee: expect.any(String),
      tax: expect.any(String),
      total: expect.any(String),
    });
  });
});
