import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import PayBillScreen from "../index";
import { createWrapper } from "@/test-utils/createWrapper";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  router: { push: jest.fn() },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderScreen() {
  const { Wrapper } = createWrapper();
  render(<PayBillScreen />, { wrapper: Wrapper });
}

function getMockPush() {
  return jest.requireMock("expo-router").router.push as jest.Mock;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("PayBillScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders the electric bill category card", () => {
    renderScreen();
    expect(screen.getByText("Electric bill")).toBeOnTheScreen();
  });

  it("renders the water bill category card", () => {
    renderScreen();
    expect(screen.getByText("Water bill")).toBeOnTheScreen();
  });

  it("renders the mobile bill category card", () => {
    renderScreen();
    expect(screen.getByText("Mobile bill")).toBeOnTheScreen();
  });

  it("renders the internet bill category card", () => {
    renderScreen();
    expect(screen.getByText("Internet bill")).toBeOnTheScreen();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  it("pressing electric card navigates to pay-bill-form with electric category", () => {
    renderScreen();
    fireEvent.press(screen.getByText("Electric bill"));
    expect(getMockPush()).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: "electric" } }),
    );
  });

  it("pressing water card navigates to pay-bill-form with water category", () => {
    renderScreen();
    fireEvent.press(screen.getByText("Water bill"));
    expect(getMockPush()).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: "water" } }),
    );
  });

  it("pressing mobile card navigates to pay-bill-form with mobile category", () => {
    renderScreen();
    fireEvent.press(screen.getByText("Mobile bill"));
    expect(getMockPush()).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: "mobile" } }),
    );
  });

  it("pressing internet card navigates to pay-bill-form with internet category", () => {
    renderScreen();
    fireEvent.press(screen.getByText("Internet bill"));
    expect(getMockPush()).toHaveBeenCalledWith(
      expect.objectContaining({ params: { category: "internet" } }),
    );
  });
});
