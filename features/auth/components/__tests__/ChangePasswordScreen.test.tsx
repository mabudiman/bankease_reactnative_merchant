import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react-native";
import { ChangePasswordScreen } from "../change-password-screen";
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
  render(<ChangePasswordScreen />, { wrapper: Wrapper });
}

function fillValidForm(newPw = "newpassword123", confirmPw = "newpassword123") {
  fireEvent.changeText(screen.getByLabelText("New password input"), newPw);
  fireEvent.changeText(screen.getByLabelText("Confirm password input"), confirmPw);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ChangePasswordScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the "Change password" header title', () => {
    renderScreen();
    // Both the header title and the submit button contain "Change password"
    expect(screen.getAllByText("Change password").length).toBeGreaterThanOrEqual(2);
  });

  it('renders the "Type your new password" label', () => {
    renderScreen();
    expect(screen.getByText("Type your new password")).toBeOnTheScreen();
  });

  it('renders the "Confirm password" label', () => {
    renderScreen();
    expect(screen.getByText("Confirm password")).toBeOnTheScreen();
  });

  it("renders new password input", () => {
    renderScreen();
    expect(screen.getByLabelText("New password input")).toBeOnTheScreen();
  });

  it("renders confirm password input", () => {
    renderScreen();
    expect(screen.getByLabelText("Confirm password input")).toBeOnTheScreen();
  });

  // ── Validation — button disabled states ────────────────────────────────────

  it("does not navigate when both fields are empty", () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Change password"));
    jest.runAllTimers();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("does not navigate when passwords are shorter than 6 chars", () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("New password input"), "abc");
    fireEvent.changeText(screen.getByLabelText("Confirm password input"), "abc");
    fireEvent.press(screen.getByLabelText("Change password"));
    jest.runAllTimers();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("does not navigate when passwords do not match", () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("New password input"), "password1");
    fireEvent.changeText(screen.getByLabelText("Confirm password input"), "password2");
    fireEvent.press(screen.getByLabelText("Change password"));
    jest.runAllTimers();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  // ── Mismatch error text ────────────────────────────────────────────────────

  it("shows mismatch error when confirm password differs from new password", () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("New password input"), "password1");
    fireEvent.changeText(screen.getByLabelText("Confirm password input"), "different");
    expect(screen.getByText("Passwords do not match")).toBeOnTheScreen();
  });

  it("does not show mismatch error when confirm password is still empty", () => {
    renderScreen();
    fireEvent.changeText(screen.getByLabelText("New password input"), "password1");
    expect(screen.queryByText("Passwords do not match")).toBeNull();
  });

  it("does not show mismatch error when passwords match", () => {
    renderScreen();
    fillValidForm();
    expect(screen.queryByText("Passwords do not match")).toBeNull();
  });

  // ── Toggle password visibility ─────────────────────────────────────────────

  it("toggling show-password changes accessibilityLabel to hide instruction", () => {
    renderScreen();
    // Both new-password and confirm-password have a Show/Hide toggle; press the first
    const toggle = screen.getAllByLabelText("Show password")[0];
    fireEvent.press(toggle);
    expect(screen.getByLabelText("Hide password")).toBeOnTheScreen();
  });

  // ── Successful submission ──────────────────────────────────────────────────

  it("navigates to change-password-success after valid submission", async () => {
    renderScreen();
    fillValidForm();
    fireEvent.press(screen.getByLabelText("Change password"));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/change-password-success");
  });

  // ── Back navigation ────────────────────────────────────────────────────────

  it("pressing back button calls router.back()", () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
