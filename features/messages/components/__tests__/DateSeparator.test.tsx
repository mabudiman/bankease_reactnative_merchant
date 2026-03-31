import React from "react";
import { render, screen } from "@testing-library/react-native";
import { DateSeparator } from "../DateSeparator";
import { createWrapper } from "@/test-utils/createWrapper";

const { Wrapper } = createWrapper();

describe("DateSeparator", () => {
  it("renders the label", () => {
    render(<DateSeparator label="Today" />, { wrapper: Wrapper });
    expect(screen.getByText("Today")).toBeOnTheScreen();
  });

  it("renders a date string label", () => {
    render(<DateSeparator label="3/31/2026" />, { wrapper: Wrapper });
    expect(screen.getByText("3/31/2026")).toBeOnTheScreen();
  });
});
