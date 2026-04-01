import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ChangePasswordSuccessScreen } from "../change-password-success-screen";
import { createWrapper } from "@/test-utils/createWrapper";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderScreen() {
  const { Wrapper } = createWrapper();
  render(<ChangePasswordSuccessScreen />, { wrapper: Wrapper });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ChangePasswordSuccessScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders the success title", () => {
    renderScreen();
    expect(screen.getByText("Change password successfully!")).toBeOnTheScreen();
  });

  it("renders the success description", () => {
    renderScreen();
    expect(
      screen.getByText(
        "You have successfully change password. Please use the new password when Sign in.",
      ),
    ).toBeOnTheScreen();
  });

  it('renders the "Ok" button', () => {
    renderScreen();
    expect(screen.getByLabelText("Ok, go back to sign in")).toBeOnTheScreen();
  });

  it("renders illustration with the correct accessibilityLabel", () => {
    renderScreen();
    expect(
      screen.getByLabelText("Password changed successfully illustration"),
    ).toBeOnTheScreen();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  it('pressing "Ok" navigates to sign-in via router.replace("/")', () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Ok, go back to sign in"));
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("pressing back button calls router.back()", () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
