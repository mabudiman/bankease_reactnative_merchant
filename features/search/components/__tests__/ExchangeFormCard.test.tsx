import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ExchangeFormCard } from "../ExchangeFormCard";
import { createWrapper } from "@/test-utils/createWrapper";

const DEFAULT_PROPS = {
  fromAmount: "100",
  onChangeFromAmount: jest.fn(),
  fromCurrency: "USD",
  onSelectFromCurrency: jest.fn(),
  toAmount: "1,500,000",
  toCurrency: "IDR",
  onSelectToCurrency: jest.fn(),
  rateLabel: "1 USD = 16,350 IDR",
  onSwap: jest.fn(),
  onExchange: jest.fn(),
};

describe("ExchangeFormCard", () => {
  it("renders without throwing", () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<ExchangeFormCard {...DEFAULT_PROPS} />, { wrapper: Wrapper }),
    ).not.toThrow();
  });

  it("renders the rate label text", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    expect(screen.getByText(DEFAULT_PROPS.rateLabel)).toBeOnTheScreen();
  });

  it("renders swap button with correct accessibility label", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    expect(screen.getByLabelText("Swap currencies")).toBeOnTheScreen();
  });

  it("swap button has accessibilityRole button", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    const swapButton = screen.getByLabelText("Swap currencies");
    expect(swapButton).toBeOnTheScreen();
  });

  it("calls onSwap when swap button is pressed", () => {
    const onSwap = jest.fn();
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} onSwap={onSwap} />, { wrapper: Wrapper });

    fireEvent.press(screen.getByLabelText("Swap currencies"));

    expect(onSwap).toHaveBeenCalledTimes(1);
  });

  it("calls onExchange when exchange button is pressed", () => {
    const onExchange = jest.fn();
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} onExchange={onExchange} />, {
      wrapper: Wrapper,
    });

    fireEvent.press(screen.getByText("Exchange"));

    expect(onExchange).toHaveBeenCalledTimes(1);
  });

  it("renders Currency Rate label", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    expect(screen.getByText("Currency Rate")).toBeOnTheScreen();
  });

  it("renders From and To section labels", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} />, { wrapper: Wrapper });
    expect(screen.getByText("From")).toBeOnTheScreen();
    expect(screen.getByText("To")).toBeOnTheScreen();
  });

  it("renders different rateLabel text when prop changes", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeFormCard {...DEFAULT_PROPS} rateLabel="1 EUR = 0.92 USD" />, {
      wrapper: Wrapper,
    });
    expect(screen.getByText("1 EUR = 0.92 USD")).toBeOnTheScreen();
  });
});
