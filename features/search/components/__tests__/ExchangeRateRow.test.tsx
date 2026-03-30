import React from "react";
import { render, screen } from "@testing-library/react-native";
import { ExchangeRateRow } from "../ExchangeRateRow";
import { createWrapper } from "@/test-utils/createWrapper";
import { MOCK_EXCHANGE_RATES } from "@/mocks/data";
import type { ExchangeRate } from "../../types";

const SAMPLE: ExchangeRate = MOCK_EXCHANGE_RATES[0]; // Vietnam, VND, VN, buy 1.403, sell 1.746

describe("ExchangeRateRow", () => {
  it("renders the country name", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeRateRow item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText(SAMPLE.country)).toBeOnTheScreen();
  });

  it("renders the buy rate", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeRateRow item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText(String(SAMPLE.buy))).toBeOnTheScreen();
  });

  it("renders the sell rate", () => {
    const { Wrapper } = createWrapper();
    render(<ExchangeRateRow item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText(String(SAMPLE.sell))).toBeOnTheScreen();
  });

  it("renders correctly for a corporate currency entry", () => {
    const { Wrapper } = createWrapper();
    const koreanRate: ExchangeRate = MOCK_EXCHANGE_RATES[2]; // Korea, KRW
    render(<ExchangeRateRow item={koreanRate} />, { wrapper: Wrapper });
    expect(screen.getByText("Korea")).toBeOnTheScreen();
  });

  it("renders buy and sell as distinct values", () => {
    const { Wrapper } = createWrapper();
    const item: ExchangeRate = {
      id: "test-1",
      country: "TestLand",
      currency: "TST",
      countryCode: "RU",
      buy: 10.0,
      sell: 20.0,
    };
    render(<ExchangeRateRow item={item} />, { wrapper: Wrapper });
    expect(screen.getByText("10")).toBeOnTheScreen();
    expect(screen.getByText("20")).toBeOnTheScreen();
  });
});
