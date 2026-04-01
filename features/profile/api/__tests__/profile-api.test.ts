import { getProfile, updateProfile } from "../profile-api";
import { request } from "@/core/api/client";
import type { UserProfileInput } from "../../types";

// Mock the API client — no MSW handler for /api/profile/*
jest.mock("@/core/api/client", () => ({
  request: jest.fn(),
}));

const mockRequest = request as jest.Mock;

// Server response shape (snake_case, as returned by the real API)
const MOCK_API_RESPONSE = {
  id: "uuid-123",
  bank: "BRI",
  branch: "Jakarta Pusat",
  name: "John Doe",
  card_number: "1234-5678-9012-3456",
  card_provider: "VISA",
  balance: 150.5, // major units — mapped to 15050 minor units
  currency: "USD",
  accountType: "PREMIUM",
  image: "https://example.com/avatar.jpg",
};

const MOCK_PROFILE_INPUT: UserProfileInput = {
  bankName: "BRI",
  branchName: "Jakarta Pusat",
  transactionName: "John Doe",
  cardNumber: "1234-5678-9012-3456",
  cardProvider: "VISA",
  currency: "USD",
};

describe("getProfile", () => {
  beforeEach(() => {
    mockRequest.mockResolvedValue(MOCK_API_RESPONSE);
  });

  it("maps server snake_case response to camelCase UserProfile", async () => {
    const result = await getProfile("uuid-123");

    expect(result).toMatchObject({
      accountId: "uuid-123",
      bankName: "BRI",
      branchName: "Jakarta Pusat",
      transactionName: "John Doe",
      cardNumber: "1234-5678-9012-3456",
      cardProvider: "VISA",
      currency: "USD",
      accountType: "PREMIUM",
      image: "https://example.com/avatar.jpg",
    });
  });

  it("converts balance from major units to minor units (×100)", async () => {
    const result = await getProfile("uuid-123");
    expect(result.balance).toBe(MOCK_API_RESPONSE.balance * 100);
  });

  it("uses response id as accountId", async () => {
    const result = await getProfile("uuid-123");
    expect(result.accountId).toBe(MOCK_API_RESPONSE.id);
  });

  it("calls the correct endpoint", async () => {
    await getProfile("uuid-123");
    expect(mockRequest).toHaveBeenCalledWith("/api/profile/uuid-123");
  });

  it("falls back to passed accountId when response id is missing", async () => {
    mockRequest.mockResolvedValue({ ...MOCK_API_RESPONSE, id: undefined });
    const result = await getProfile("fallback-id");
    expect(result.accountId).toBe("fallback-id");
  });

  it("handles missing optional image field", async () => {
    mockRequest.mockResolvedValue({ ...MOCK_API_RESPONSE, image: undefined });
    const result = await getProfile("uuid-123");
    expect(result.image).toBeUndefined();
  });
});

describe("updateProfile", () => {
  beforeEach(() => {
    mockRequest.mockResolvedValue(MOCK_API_RESPONSE);
  });

  it("calls the correct endpoint with PUT method", async () => {
    await updateProfile("uuid-123", MOCK_PROFILE_INPUT);

    expect(mockRequest).toHaveBeenCalledWith(
      "/api/profile/uuid-123",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("sends payload mapped to snake_case", async () => {
    await updateProfile("uuid-123", MOCK_PROFILE_INPUT);

    const callArgs = mockRequest.mock.calls[0];
    const options = callArgs[1];
    const body = JSON.parse(options.body);

    expect(body).toMatchObject({
      bank: MOCK_PROFILE_INPUT.bankName,
      branch: MOCK_PROFILE_INPUT.branchName,
      name: MOCK_PROFILE_INPUT.transactionName,
      card_number: MOCK_PROFILE_INPUT.cardNumber,
      card_provider: MOCK_PROFILE_INPUT.cardProvider,
      currency: MOCK_PROFILE_INPUT.currency,
    });
  });

  it("returns mapped UserProfile from server response", async () => {
    const result = await updateProfile("uuid-123", MOCK_PROFILE_INPUT);

    expect(result).toMatchObject({
      accountId: MOCK_API_RESPONSE.id,
      bankName: MOCK_API_RESPONSE.bank,
      balance: MOCK_API_RESPONSE.balance * 100,
    });
  });
});
