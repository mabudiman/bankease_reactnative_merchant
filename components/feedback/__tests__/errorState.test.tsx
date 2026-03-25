import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ErrorState } from "../errorState";
import { createWrapper } from "@/test-utils/createWrapper";

describe("ErrorState", () => {
  it("renders the message", () => {
    const { Wrapper } = createWrapper();
    render(
      <ErrorState message="Something went wrong" />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("Something went wrong")).toBeOnTheScreen();
  });

  it("does not show Retry button when recoverable is false", () => {
    const { Wrapper } = createWrapper();
    render(
      <ErrorState message="Error" recoverable={false} />,
      { wrapper: Wrapper },
    );
    expect(screen.queryByText("Try again")).not.toBeOnTheScreen();
  });

  it("shows Retry button when recoverable is true", () => {
    const { Wrapper } = createWrapper();
    render(
      <ErrorState message="Error" recoverable onRetry={() => {}} />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("Try again")).toBeOnTheScreen();
  });

  it("calls onRetry when user taps Retry", () => {
    const onRetry = jest.fn();
    const { Wrapper } = createWrapper();
    render(
      <ErrorState message="Error" recoverable onRetry={onRetry} />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
