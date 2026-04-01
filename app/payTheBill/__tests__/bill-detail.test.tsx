import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import BillDetailScreen from "../bill-detail";
import { createWrapper } from "@/test-utils/createWrapper";
import { INTERNET_BILL_DETAIL } from "@/mocks/data";

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
  render(<BillDetailScreen />, { wrapper: Wrapper });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("BillDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders correct header for internet category", () => {
    renderScreen("internet");
    expect(screen.getByText("Internet bill")).toBeOnTheScreen();
  });

  it("renders correct header for electric category", () => {
    renderScreen("electric");
    expect(screen.getByText("Electric bill")).toBeOnTheScreen();
  });

  it("renders correct header for water category", () => {
    renderScreen("water");
    expect(screen.getByText("Water bill")).toBeOnTheScreen();
  });

  it("renders correct header for mobile category", () => {
    renderScreen("mobile");
    expect(screen.getByText("Mobile bill")).toBeOnTheScreen();
  });

  it("renders customer name from bill data", () => {
    renderScreen();
    expect(screen.getByText(INTERNET_BILL_DETAIL.name)).toBeOnTheScreen();
  });

  it("renders address from bill data", () => {
    renderScreen();
    expect(screen.getByText(INTERNET_BILL_DETAIL.address)).toBeOnTheScreen();
  });

  it("renders phone number from bill data", () => {
    renderScreen();
    expect(screen.getByText(INTERNET_BILL_DETAIL.phoneNumber)).toBeOnTheScreen();
  });

  it("renders the pay bill button", () => {
    renderScreen();
    expect(screen.getByText("Pay the Bill")).toBeOnTheScreen();
  });

  it("renders the OTP label", () => {
    renderScreen();
    expect(screen.getByText("Get OTP to verify transaction")).toBeOnTheScreen();
  });

  it("renders the Get OTP button", () => {
    renderScreen();
    expect(screen.getByText("Get OTP")).toBeOnTheScreen();
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  it("pay bill button is disabled when OTP is empty", () => {
    renderScreen();
    const payButton = screen.getByLabelText("Pay the Bill");
    expect(payButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("pay bill button is disabled when OTP has fewer than 6 digits", () => {
    renderScreen();
    const otpInput = screen.getByPlaceholderText("OTP");
    fireEvent.changeText(otpInput, "1234");
    const payButton = screen.getByLabelText("Pay the Bill");
    expect(payButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("pay bill button is enabled with a 6-digit OTP", () => {
    renderScreen();
    const otpInput = screen.getByPlaceholderText("OTP");
    fireEvent.changeText(otpInput, "123456");
    const payButton = screen.getByLabelText("Pay the Bill");
    expect(payButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("pressing pay navigates to payment-success with the correct category", () => {
    renderScreen("electric");
    const otpInput = screen.getByPlaceholderText("OTP");
    fireEvent.changeText(otpInput, "123456");
    fireEvent.press(screen.getByLabelText("Pay the Bill"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: "electric" } }),
    );
  });

  it("renders the back button", () => {
    renderScreen();
    expect(screen.getByLabelText("Go back")).toBeOnTheScreen();
  });

  it("pressing back calls router.back", () => {
    renderScreen();
    fireEvent.press(screen.getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
