import { getBeneficiaries, submitPrepaid } from "../api";

describe("mobile-prepaid API", () => {
  describe("getBeneficiaries", () => {
    it("returns a list of beneficiaries", async () => {
      const result = await getBeneficiaries("demo-002");
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "ben-001", name: "Emma" }),
          expect.objectContaining({ id: "ben-002", name: "Justin" }),
        ]),
      );
    });
  });

  describe("submitPrepaid", () => {
    it("returns SUCCESS for valid payment", async () => {
      const result = await submitPrepaid({
        cardId: "card-001",
        phone: "+8564757899",
        amount: 1000,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it("returns FAILED for invalid phone", async () => {
      const result = await submitPrepaid({
        cardId: "card-001",
        phone: "+0000000000",
        amount: 1000,
      });
      expect(result.status).toBe("FAILED");
      expect(result.message).toBe("Invalid phone number");
    });
  });
});
