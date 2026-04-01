import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { MessageItem } from "../MessageItem";
import { createWrapper } from "@/test-utils/createWrapper";
import { MOCK_MESSAGES } from "@/mocks/data";

const TODAY_ISO = new Date().toISOString();
const MOCK_ITEM_TODAY = { ...MOCK_MESSAGES[0], date: TODAY_ISO };
const MOCK_ITEM_PAST = { ...MOCK_MESSAGES[1], date: "2025-10-12T08:00:00.000Z" };

describe("MessageItem", () => {
  it("renders the item title", () => {
    const { Wrapper } = createWrapper();
    render(
      <MessageItem item={MOCK_ITEM_TODAY} todayLabel="Today" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText(MOCK_ITEM_TODAY.title)).toBeOnTheScreen();
  });

  it("renders the item preview", () => {
    const { Wrapper } = createWrapper();
    render(
      <MessageItem item={MOCK_ITEM_TODAY} todayLabel="Today" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText(MOCK_ITEM_TODAY.preview)).toBeOnTheScreen();
  });

  it("shows 'Today' label when date is today", () => {
    const { Wrapper } = createWrapper();
    render(
      <MessageItem item={MOCK_ITEM_TODAY} todayLabel="Today" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText("Today")).toBeOnTheScreen();
  });

  it("shows DD/MM format for a non-today date", () => {
    const { Wrapper } = createWrapper();
    render(
      <MessageItem item={MOCK_ITEM_PAST} todayLabel="Today" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByText("12/10")).toBeOnTheScreen();
  });

  it("has accessibilityRole button", () => {
    const { Wrapper } = createWrapper();
    render(
      <MessageItem item={MOCK_ITEM_TODAY} todayLabel="Today" />,
      { wrapper: Wrapper }
    );
    expect(screen.getByRole("button")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <MessageItem item={MOCK_ITEM_TODAY} todayLabel="Today" onPress={onPress} />,
      { wrapper: Wrapper }
    );
    fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onPress is not provided", () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(
        <MessageItem item={MOCK_ITEM_TODAY} todayLabel="Today" />,
        { wrapper: Wrapper }
      )
    ).not.toThrow();
  });
});
