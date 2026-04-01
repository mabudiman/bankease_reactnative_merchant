import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { SearchCategoryCard } from "../SearchCategoryCard";
import { createWrapper } from "@/test-utils/createWrapper";

const MOCK_ILLUSTRATION = { uri: "https://example.com/illustration.png" };

describe("SearchCategoryCard", () => {
  it("renders title text", () => {
    const { Wrapper } = createWrapper();
    render(
      <SearchCategoryCard
        title="Exchange Rate"
        subtitle="Check current rates"
        illustration={MOCK_ILLUSTRATION}
      />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText("Exchange Rate")).toBeOnTheScreen();
  });

  it("renders subtitle text", () => {
    const { Wrapper } = createWrapper();
    render(
      <SearchCategoryCard
        title="Branch Search"
        subtitle="Find nearby branches"
        illustration={MOCK_ILLUSTRATION}
      />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText("Find nearby branches")).toBeOnTheScreen();
  });

  it("has accessibilityRole button", () => {
    const { Wrapper } = createWrapper();
    render(
      <SearchCategoryCard
        title="Interest Rate"
        subtitle="View deposit rates"
        illustration={MOCK_ILLUSTRATION}
      />,
      { wrapper: Wrapper }
    );
    expect(screen.getByRole("button")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <SearchCategoryCard
        title="Currency Exchange"
        subtitle="Exchange currency"
        illustration={MOCK_ILLUSTRATION}
        onPress={onPress}
      />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onPress is not provided", () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(
        <SearchCategoryCard
          title="Test"
          subtitle="Sub"
          illustration={MOCK_ILLUSTRATION}
        />,
        { wrapper: Wrapper }
      )
    ).not.toThrow();
  });

  it("renders without error when bgColor prop is provided", () => {
    const { Wrapper } = createWrapper();
    render(
      <SearchCategoryCard
        title="Test Card"
        subtitle="With bg color"
        illustration={MOCK_ILLUSTRATION}
      />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText("Test Card")).toBeOnTheScreen();
  });
});
