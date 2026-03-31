import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/test-utils/createWrapper";
import { useExchangeRates, useInterestRates, useBranches } from "../index";
import { MOCK_EXCHANGE_RATES, MOCK_INTEREST_RATES, MOCK_BRANCHES } from "@/mocks/data";

describe("useExchangeRates", () => {
  it("fetches exchange rates successfully", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(MOCK_EXCHANGE_RATES.length);
  });

  it("returns items with buy and sell fields", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const first = result.current.data![0];
    expect(first.buy).toBe(MOCK_EXCHANGE_RATES[0].buy);
    expect(first.sell).toBe(MOCK_EXCHANGE_RATES[0].sell);
  });

  it("starts in loading state", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});

describe("useInterestRates", () => {
  it("fetches interest rates successfully", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInterestRates(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(MOCK_INTEREST_RATES.length);
  });

  it("returns both individual and corporate entries", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInterestRates(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const kinds = result.current.data!.map((r) => r.kind);
    expect(kinds).toContain("individual");
    expect(kinds).toContain("corporate");
  });
});

describe("useBranches", () => {
  it("fetches all branches when query is empty", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useBranches(""), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(MOCK_BRANCHES.length);
  });

  it("returns filtered branches for a matching query", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useBranches("tanah"), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data!.length).toBeGreaterThan(0);
    for (const branch of result.current.data!) {
      expect(branch.name.toLowerCase()).toContain("tanah");
    }
  });

  it("returns empty array for a non-matching query", async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useBranches("zzznomatch"), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(0);
  });

  it("query key changes when query changes", async () => {
    const { Wrapper } = createWrapper();

    // First hook instance with 'tanah'
    const { result: r1 } = renderHook(() => useBranches("tanah"), { wrapper: Wrapper });
    await waitFor(() => expect(r1.current.isSuccess).toBe(true));

    // Second hook instance with '' (all results)
    const { result: r2 } = renderHook(() => useBranches(""), { wrapper: Wrapper });
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    expect(r1.current.data!.length).toBeLessThan(r2.current.data!.length);
  });
});
