import { renderHook, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useProfile } from "../useProfile";
import type { UserProfileInput } from "../../types";
import type { LocalAuthAccount } from "@/features/auth/types";

// Mock auth service and profile service to avoid real network requests
jest.mock("@/features/auth/services/auth-service", () => ({
  authService: {
    getSessionAccount: jest.fn(),
  },
}));

jest.mock("@/features/profile/services/profile-service", () => ({
  profileService: {
    loadProfile: jest.fn(),
    saveProfile: jest.fn(),
  },
}));

import { authService } from "@/features/auth/services/auth-service";
import { profileService } from "@/features/profile/services/profile-service";

const mockGetSessionAccount = authService.getSessionAccount as jest.Mock;
const mockLoadProfile = profileService.loadProfile as jest.Mock;
const mockSaveProfile = profileService.saveProfile as jest.Mock;

const MOCK_USER: LocalAuthAccount = {
  id: "demo-001",
  name: "Demo User",
  phone: "081234567890",
  password: "demo1234",
  createdAt: "2024-01-01T00:00:00Z",
};

const MOCK_PROFILE = {
  accountId: "demo-001",
  bankName: "BRI",
  branchName: "Jakarta Pusat",
  transactionName: "Demo User",
  cardNumber: "1234-5678-9012-3456",
  cardProvider: "VISA",
  balance: 15050,
  currency: "USD",
  accountType: "REGULAR",
};

const MOCK_PROFILE_INPUT: UserProfileInput = {
  bankName: "BRI Updated",
  branchName: "Bandung",
  transactionName: "Demo User Updated",
  cardNumber: "1234-5678-9012-3456",
  cardProvider: "VISA",
  currency: "IDR",
};

describe("useProfile", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  describe("initial loading", () => {
    it("starts with isLoading true", () => {
      mockGetSessionAccount.mockReturnValue(new Promise(() => {})); // never resolves

      const { result } = renderHook(() => useProfile());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
    });
  });

  describe("when no session exists", () => {
    it("sets isLoading false and leaves user and profile null", async () => {
      mockGetSessionAccount.mockResolvedValue(null);

      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
    });
  });

  describe("when session exists", () => {
    beforeEach(() => {
      mockGetSessionAccount.mockResolvedValue(MOCK_USER);
      mockLoadProfile.mockResolvedValue(MOCK_PROFILE);
    });

    it("loads user and profile after effect runs", async () => {
      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.user).toEqual(MOCK_USER);
      expect(result.current.profile).toEqual(MOCK_PROFILE);
      expect(result.current.isSaving).toBe(false);
    });

    it("passes the user id to profileService.loadProfile", async () => {
      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockLoadProfile).toHaveBeenCalledWith(MOCK_USER.id);
    });
  });

  describe("saveProfile", () => {
    it("returns false immediately when no user is loaded", async () => {
      mockGetSessionAccount.mockResolvedValue(null);

      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.saveProfile(MOCK_PROFILE_INPUT);
      });

      expect(success).toBe(false);
    });

    it("returns true and shows success alert on save success", async () => {
      mockGetSessionAccount.mockResolvedValue(MOCK_USER);
      mockLoadProfile.mockResolvedValue(MOCK_PROFILE);
      mockSaveProfile.mockResolvedValue(MOCK_PROFILE);

      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.saveProfile(MOCK_PROFILE_INPUT);
      });

      expect(success).toBe(true);
      expect(alertSpy).toHaveBeenCalledWith("Success", expect.any(String));
    });

    it("returns false and shows failure alert on save error", async () => {
      mockGetSessionAccount.mockResolvedValue(MOCK_USER);
      mockLoadProfile.mockResolvedValue(MOCK_PROFILE);
      mockSaveProfile.mockRejectedValue(new Error("Save failed"));

      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.saveProfile(MOCK_PROFILE_INPUT);
      });

      expect(success).toBe(false);
      expect(alertSpy).toHaveBeenCalledWith("Failed", expect.any(String));
    });

    it("sets isSaving false after save completes", async () => {
      mockGetSessionAccount.mockResolvedValue(MOCK_USER);
      mockLoadProfile.mockResolvedValue(MOCK_PROFILE);
      mockSaveProfile.mockResolvedValue(MOCK_PROFILE);

      const { result } = renderHook(() => useProfile());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.saveProfile(MOCK_PROFILE_INPUT);
      });

      expect(result.current.isSaving).toBe(false);
    });
  });
});
