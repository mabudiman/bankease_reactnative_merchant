import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import PaymentSuccessScreen from "../payment-success";
import { createWrapper } from "@/test-utils/createWrapper";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
  useLocalSearchParams: jest.fn(),
}));

const { useLocalSearchParams } = jest.requireMock("expo-router");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderScreen(category = "internet") {
  useLocalSearchParams.mockReturnValue({ category });
  const { Wrapper } = createWrapper();
  render(<PaymentSuccessScreen />, { wrapper: Wrapper });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("PaymentSuccessScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders the success title", () => {
    renderScreen();
    expect(screen.getByText("Transaction successfully!")).toBeOnTheScreen();
  });

  it("renders the subtitle with bill name interpolated", () => {
    renderScreen("internet");
    expect(screen.getByText("You've paid your Internet bill")).toBeOnTheScreen();
  });

  it('renders the "Confirm" button', () => {
    renderScreen();
    expect(screen.getByText("Confirm")).toBeOnTheScreen();
  });

  it("renders illustration with correct accessibilityLabel", () => {
    renderScreen();
    expect(screen.getByLabelText("Payment successful illustration")).toBeOnTheScreen();
  });

  it("renders correct header title for electric category", () => {
    renderScreen("electric");
    expect(screen.getByText("Electric bill")).toBeOnTheScreen();
  });

  it("renders correct subtitle for electric category", () => {
    renderScreen("electric");
    expect(screen.getByText("You've paid your Electric bill")).toBeOnTheScreen();
  });

  it("renders correct header title for water category", () => {
    renderScreen("water");
    expect(screen.getByText("Water bill")).toBeOnTheScreen();
  });

  it("renders correct header title for mobile category", () => {
    renderScreen("mobile");
    expect(screen.getByText("Mobile bill")).toBeOnTheScreen();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  it('pressing "Confirm" navigates to /(tabs) via router.replace', () => {
    renderScreen();
    fireEvent.press(screen.getByText("Confirm"));
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });

  it("pressing back button calls router.back()", () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("defaults to internet category when category param is absent", () => {
    useLocalSearchParams.mockReturnValue({});
    const { Wrapper } = createWrapper();
    render(<PaymentSuccessScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Internet bill")).toBeOnTheScreen();
  });
});
