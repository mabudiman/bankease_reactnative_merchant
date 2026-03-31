import { getBeneficiaries, addBeneficiary, purchasePrepaid } from "../index";
import { MOCK_BENEFICIARIES } from "@/mocks/data";

describe("mobile-prepaid API", () => {
  // ── getBeneficiaries ────────────────────────────────────────────────────────

  describe("getBeneficiaries", () => {
    it("returns all beneficiaries", async () => {
      const result = await getBeneficiaries();
      expect(result).toHaveLength(MOCK_BENEFICIARIES.length);
    });

    it("each item has required fields", async () => {
      const result = await getBeneficiaries();
      for (const item of result) {
        expect(item).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          phoneNumber: expect.any(String),
        });
      }
    });

    it("returns data matching first mock entry", async () => {
      const result = await getBeneficiaries();
      expect(result[0]).toMatchObject({
        id: MOCK_BENEFICIARIES[0].id,
        name: MOCK_BENEFICIARIES[0].name,
      });
    });
  });

  // ── addBeneficiary ──────────────────────────────────────────────────────────

  describe("addBeneficiary", () => {
    it("returns a new beneficiary with an id", async () => {
      const result = await addBeneficiary({
        name: "Alice",
        phoneNumber: "+1234567890",
      });
      expect(result).toMatchObject({
        id: expect.any(String),
        name: "Alice",
        phoneNumber: "+1234567890",
      });
    });
  });

  // ── purchasePrepaid ─────────────────────────────────────────────────────────

  describe("purchasePrepaid", () => {
    it("returns a success response", async () => {
      const result = await purchasePrepaid({
        cardId: "card-001-1",
        phoneNumber: "+8564757899",
        amount: 1000,
      });
      expect(result).toMatchObject({
        id: expect.any(String),
        status: "success",
        message: expect.any(String),
      });
    });

    it("returns a valid transaction id", async () => {
      const result = await purchasePrepaid({
        cardId: "card-001-1",
        phoneNumber: "+8564757899",
        amount: 2000,
      });
      expect(result.id).toBeTruthy();
      expect(result.id.length).toBeGreaterThan(0);
    });
  });
});
