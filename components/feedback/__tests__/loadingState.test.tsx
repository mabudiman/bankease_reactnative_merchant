import React from "react";
import { render, screen } from "@testing-library/react-native";
import { LoadingState } from "../loadingState";
import { createWrapper } from "@/test-utils/createWrapper";

describe("LoadingState", () => {
  it("renders loading text from i18n", () => {
    const { Wrapper } = createWrapper();
    render(<LoadingState />, { wrapper: Wrapper });
    expect(screen.getByText("Loading...")).toBeOnTheScreen();
  });

  it("has accessible alert role", () => {
    const { Wrapper } = createWrapper();
    render(<LoadingState />, { wrapper: Wrapper });
    const container = screen.getByRole("alert");
    expect(container).toBeOnTheScreen();
  });
});
