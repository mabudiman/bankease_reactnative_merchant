import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { createWrapper } from "@/test-utils/createWrapper";
import { AccountPickerSheet } from "../AccountPickerSheet";
import type { PaymentCard } from "@/features/dashboard/types";

const MOCK_CARDS: PaymentCard[] = [
  {
    id: "card-001-1",
    accountId: "demo-001",
    holderName: "John Smith",
    cardLabel: "Amazon Platinium",
    maskedNumber: "4756  ••••  ••••  9018",
    balance: 346952,
    currency: "USD",
    brand: "VISA",
    gradientColors: ["#1A1563", "#1E2FA0", "#3B7ED4"],
  },
  {
    id: "card-001-2",
    accountId: "demo-001",
    holderName: "John Smith",
    cardLabel: "Gold Card",
    maskedNumber: "5281  ••••  ••••  4471",
    balance: 123400,
    currency: "USD",
    brand: "MASTERCARD",
    gradientColors: ["#2D1B69", "#5B2D8E", "#8E4EC6"],
  },
];

describe("AccountPickerSheet", () => {
  const onSelect = jest.fn();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders card labels when visible", () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountPickerSheet
        visible
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("Amazon Platinium")).toBeOnTheScreen();
    expect(screen.getByText("Gold Card")).toBeOnTheScreen();
  });

  it("calls onSelect when a card is pressed", () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountPickerSheet
        visible
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText("VISA 4756  ••••  ••••  9018"));
    expect(onSelect).toHaveBeenCalledWith(MOCK_CARDS[0]);
  });

  it("shows empty message when no cards", () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountPickerSheet
        visible
        cards={[]}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("No cards available")).toBeOnTheScreen();
  });

  it("renders the close button", () => {
    const { Wrapper } = createWrapper();
    render(
      <AccountPickerSheet
        visible
        cards={MOCK_CARDS}
        selectedCardId={null}
        onSelect={onSelect}
        onClose={onClose}
      />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
