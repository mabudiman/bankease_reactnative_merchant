import React from "react";
import { render, screen } from "@testing-library/react-native";
import { FeatureMenuGrid } from "../FeatureMenuGrid";
import { createWrapper } from "@/test-utils/createWrapper";
import type { Privilege } from "../../types";

const { Wrapper } = createWrapper();

const PRIVILEGES: Privilege[] = [
  { code: "TRANSFER", title: "Transfer", icon: "swap-horizontal", enabled: true, color: "#3629B7" },
  { code: "HISTORY", title: "History", icon: "time", enabled: true, color: "#3629B7" },
  { code: "DISABLED", title: "Disabled", icon: "lock-closed", enabled: false, color: "#999" },
];

describe("FeatureMenuGrid", () => {
  it("renders enabled privileges", () => {
    render(<FeatureMenuGrid privileges={PRIVILEGES} />, { wrapper: Wrapper });
    expect(screen.getByText("Transfer")).toBeOnTheScreen();
    expect(screen.getByText("History")).toBeOnTheScreen();
  });

  it("does not render disabled privileges", () => {
    render(<FeatureMenuGrid privileges={PRIVILEGES} />, { wrapper: Wrapper });
    expect(screen.queryByText("Disabled")).not.toBeOnTheScreen();
  });

  it("renders empty with no privileges", () => {
    render(<FeatureMenuGrid privileges={[]} />, { wrapper: Wrapper });
    expect(screen.queryByText("Transfer")).not.toBeOnTheScreen();
  });
});
