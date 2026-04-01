// features/mobile-prepaid/__tests__/CardSelectorSheet.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CardSelectorSheet } from "../components/CardSelectorSheet";
import type { PaymentCard } from "@/features/dashboard/types";

const MOCK_CARDS: PaymentCard[] = [
  {
    id: "card-001",
    accountId: "demo-002",
    holderName: "John Doe",
    cardLabel: "VISA Platinum",
    maskedNumber: "4111  ••••  ••••  1234",
    balance: 1000000,
    currency: "USD",
    brand: "VISA",
    gradientColors: ["#1A1563", "#1E2FA0", "#3B7ED4"],
  },
  {
    id: "card-002",
    accountId: "demo-002",
    holderName: "John Doe",
    cardLabel: "MC Gold",
    maskedNumber: "5200  ••••  ••••  5678",
    balance: 500000,
    currency: "USD",
    brand: "MASTERCARD",
    gradientColors: ["#2D1B69", "#5B2D8E", "#8E4EC6"],
  },
];

describe("CardSelectorSheet", () => {
  const onSelect = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
    onClose.mockClear();
  });

  it("renders card masked numbers when visible", () => {
    const { getByText } = render(
      <CardSelectorSheet
        visible={true}
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    expect(getByText("4111  ••••  ••••  1234")).toBeTruthy();
    expect(getByText("5200  ••••  ••••  5678")).toBeTruthy();
  });

  it("calls onSelect and onClose when a card is tapped", () => {
    const { getByText } = render(
      <CardSelectorSheet
        visible={true}
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    fireEvent.press(getByText("4111  ••••  ••••  1234"));
    expect(onSelect).toHaveBeenCalledWith(MOCK_CARDS[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render content when not visible", () => {
    const { queryByText } = render(
      <CardSelectorSheet
        visible={false}
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    expect(queryByText("4111  ••••  ••••  1234")).toBeNull();
  });
});
