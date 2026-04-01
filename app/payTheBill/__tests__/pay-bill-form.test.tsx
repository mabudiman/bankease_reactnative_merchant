import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import PayBillFormScreen from "../pay-bill-form";
import { createWrapper } from "@/test-utils/createWrapper";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useLocalSearchParams: jest.fn(),
  router: {
    push: (...args: any[]) => mockPush(...args),
    back: (...args: any[]) => mockBack(...args),
  },
}));

const { useLocalSearchParams } = jest.requireMock("expo-router");

// ─── Helpers ─────────────────────────────────────────────────────────────────

type BillCategory = "internet" | "electric" | "water" | "mobile";

function renderScreen(category: BillCategory = "internet") {
  useLocalSearchParams.mockReturnValue({ category });
  const { Wrapper } = createWrapper();
  render(<PayBillFormScreen />, { wrapper: Wrapper });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("PayBillFormScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders correct title for internet category", () => {
    renderScreen("internet");
    expect(screen.getByText("Pay internet bill")).toBeOnTheScreen();
  });

  it("renders correct title for electric category", () => {
    renderScreen("electric");
    expect(screen.getByText("Pay electric bill")).toBeOnTheScreen();
  });

  it("renders correct title for water category", () => {
    renderScreen("water");
    expect(screen.getByText("Pay water bill")).toBeOnTheScreen();
  });

  it("renders correct title for mobile category", () => {
    renderScreen("mobile");
    expect(screen.getByText("Pay mobile bill")).toBeOnTheScreen();
  });

  it("renders the provider selector", () => {
    renderScreen();
    expect(screen.getByText("Choose company")).toBeOnTheScreen();
  });

  it("renders the bill code input", () => {
    renderScreen();
    expect(screen.getByText("Type internet bill code")).toBeOnTheScreen();
  });

  it("renders the check button", () => {
    renderScreen();
    expect(screen.getByText("Check")).toBeOnTheScreen();
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  it("check button is disabled when bill code is empty", () => {
    renderScreen();
    const checkButton = screen.getByLabelText("Check");
    expect(checkButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("navigates to bill-detail after entering bill code and pressing check", () => {
    renderScreen("internet");
    const input = screen.getByPlaceholderText("Bill code");
    fireEvent.changeText(input, "12345678");
    fireEvent.press(screen.getByLabelText("Check"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: "internet" } }),
    );
  });

  it("shows helper text about bill code", () => {
    renderScreen();
    expect(screen.getByText(/Please enter the correct bill code/i)).toBeOnTheScreen();
  });
});
