import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ForgotPasswordScreen } from "../forgot-password-screen";
import { createWrapper } from "@/test-utils/createWrapper";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderScreen() {
  const { Wrapper } = createWrapper();
  render(<ForgotPasswordScreen />, { wrapper: Wrapper });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the "Forgot password" header title', () => {
    renderScreen();
    expect(screen.getByText("Forgot password")).toBeOnTheScreen();
  });

  it('renders the "Type a code" label', () => {
    renderScreen();
    expect(screen.getByText("Type a code")).toBeOnTheScreen();
  });

  it("renders the OTP code input", () => {
    renderScreen();
    expect(screen.getByLabelText("OTP code input")).toBeOnTheScreen();
  });

  it('renders the "Resend code" button', () => {
    renderScreen();
    expect(screen.getByLabelText("Resend code")).toBeOnTheScreen();
  });

  it("renders the helper text about texting a code", () => {
    renderScreen();
    expect(
      screen.getByText(/We texted you a code to verify your phone number/i),
    ).toBeOnTheScreen();
  });

  // ── Validation — button state ──────────────────────────────────────────────

  it('"Change password" button does not navigate when code is empty', () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Change password"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('"Change password" button does not navigate when code has fewer than 4 chars', () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("OTP code input"), "123");
    fireEvent.press(screen.getByLabelText("Change password"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('"Change password" button navigates when code has exactly 4 chars', () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("OTP code input"), "1234");
    fireEvent.press(screen.getByLabelText("Change password"));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/change-password");
  });

  it('"Change password" button navigates when code has 6 chars', () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("OTP code input"), "123456");
    fireEvent.press(screen.getByLabelText("Change password"));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/change-password");
  });

  // ── Back navigation ────────────────────────────────────────────────────────

  it("pressing back button calls router.back()", () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
