import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/test-utils/createWrapper";
import { useBeneficiaries, useAddBeneficiary, usePrepaidPurchase } from "../index";
import { MOCK_BENEFICIARIES } from "@/mocks/data";

describe("mobile-prepaid hooks", () => {
  // ── useBeneficiaries ────────────────────────────────────────────────────────

  describe("useBeneficiaries", () => {
    it("starts in loading state", () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useBeneficiaries(), { wrapper: Wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("fetches data successfully", async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useBeneficiaries(), { wrapper: Wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(MOCK_BENEFICIARIES.length);
    });

    it("returns correct first beneficiary", async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useBeneficiaries(), { wrapper: Wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data![0].id).toBe(MOCK_BENEFICIARIES[0].id);
    });
  });

  // ── useAddBeneficiary ───────────────────────────────────────────────────────

  describe("useAddBeneficiary", () => {
    it("adds a beneficiary successfully", async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAddBeneficiary(), { wrapper: Wrapper });

      result.current.mutate({ name: "TestUser", phoneNumber: "+9999999" });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toMatchObject({
        id: expect.any(String),
        name: "TestUser",
        phoneNumber: "+9999999",
      });
    });
  });

  // ── usePrepaidPurchase ──────────────────────────────────────────────────────

  describe("usePrepaidPurchase", () => {
    it("completes a purchase successfully", async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePrepaidPurchase(), { wrapper: Wrapper });

      result.current.mutate({
        cardId: "card-001-1",
        phoneNumber: "+8564757899",
        amount: 1000,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
      expect(result.current.data).toMatchObject({
        id: expect.any(String),
        status: "success",
      });
    });
  });
});
