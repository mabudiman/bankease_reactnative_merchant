import React from "react";
import { render, screen } from "@testing-library/react-native";
import { EmptyState } from "../emptyState";
import { createWrapper } from "@/test-utils/createWrapper";

describe("EmptyState", () => {
  it("renders default title and description from i18n when no props", () => {
    const { Wrapper } = createWrapper();
    render(<EmptyState />, { wrapper: Wrapper });
    expect(screen.getByText("Nothing here yet")).toBeOnTheScreen();
    expect(
      screen.getByText("Data will appear once it's available."),
    ).toBeOnTheScreen();
  });

  it("renders custom title and description when provided", () => {
    const { Wrapper } = createWrapper();
    render(
      <EmptyState
        title="No transactions yet"
        description="Your activity will appear here."
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("No transactions yet")).toBeOnTheScreen();
    expect(
      screen.getByText("Your activity will appear here."),
    ).toBeOnTheScreen();
  });

  it("has accessibility label for no data", () => {
    const { Wrapper } = createWrapper();
    render(<EmptyState />, { wrapper: Wrapper });
    const container = screen.getByLabelText("No data available");
    expect(container).toBeOnTheScreen();
  });
});
