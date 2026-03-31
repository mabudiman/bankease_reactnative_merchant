import React from "react";
import { render, screen } from "@testing-library/react-native";
import { AccountCard } from "../AccountCard";
import { AccountCardCarousel } from "../AccountCardCarousel";
import { createWrapper } from "@/test-utils/createWrapper";
import type { PaymentCard } from "../../types";

const { Wrapper } = createWrapper();

const VISA_CARD: PaymentCard = {
  id: "card-1",
  accountId: "acc-1",
  holderName: "John Doe",
  cardLabel: "Savings",
  maskedNumber: "•••• •••• •••• 1234",
  balance: 150000,
  currency: "USD",
  brand: "VISA",
  gradientColors: ["#3629B7", "#6C63FF"],
};

const MC_CARD: PaymentCard = {
  id: "card-2",
  accountId: "acc-2",
  holderName: "Jane Doe",
  cardLabel: "Business",
  maskedNumber: "•••• •••• •••• 5678",
  balance: 200000,
  currency: "USD",
  brand: "MASTERCARD",
  gradientColors: ["#1A1A2E", "#16213E"],
};

describe("AccountCard", () => {
  it("renders VISA card details", () => {
    render(<AccountCard card={VISA_CARD} />, { wrapper: Wrapper });
    expect(screen.getByText("John Doe")).toBeOnTheScreen();
    expect(screen.getByText("Savings")).toBeOnTheScreen();
  });

  it("renders MASTERCARD card details", () => {
    render(<AccountCard card={MC_CARD} />, { wrapper: Wrapper });
    expect(screen.getByText("Jane Doe")).toBeOnTheScreen();
    expect(screen.getByText("Business")).toBeOnTheScreen();
  });
});

describe("AccountCardCarousel", () => {
  it("renders a single card", () => {
    render(<AccountCardCarousel cards={[VISA_CARD]} />, { wrapper: Wrapper });
    expect(screen.getByText("John Doe")).toBeOnTheScreen();
  });

  it("renders multiple cards", () => {
    render(<AccountCardCarousel cards={[VISA_CARD, MC_CARD]} />, {
      wrapper: Wrapper,
    });
    expect(screen.getByText("John Doe")).toBeOnTheScreen();
    expect(screen.getByText("Jane Doe")).toBeOnTheScreen();
  });

  it("renders empty without crashing", () => {
    render(<AccountCardCarousel cards={[]} />, { wrapper: Wrapper });
  });
});
