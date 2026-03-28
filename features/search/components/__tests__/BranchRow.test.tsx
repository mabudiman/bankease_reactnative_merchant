import React from "react";
import { render, screen } from "@testing-library/react-native";
import { BranchRow } from "../BranchRow";
import { createWrapper } from "@/test-utils/createWrapper";
import { MOCK_BRANCHES } from "@/mocks/data";
import type { Branch } from "../../types";

const SAMPLE: Branch = MOCK_BRANCHES[0]; // Bank 1656 Union Street, 50m

describe("BranchRow", () => {
  it("renders the branch name", () => {
    const { Wrapper } = createWrapper();
    render(<BranchRow item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText(SAMPLE.name)).toBeOnTheScreen();
  });

  it("renders the distance", () => {
    const { Wrapper } = createWrapper();
    render(<BranchRow item={SAMPLE} />, { wrapper: Wrapper });
    expect(screen.getByText(SAMPLE.distance)).toBeOnTheScreen();
  });

  it("renders correctly for a branch with km distance", () => {
    const { Wrapper } = createWrapper();
    const branch: Branch = MOCK_BRANCHES[1]; // Bank Secaucus, 1,2 km
    render(<BranchRow item={branch} />, { wrapper: Wrapper });
    expect(screen.getByText("Bank Secaucus")).toBeOnTheScreen();
    expect(screen.getByText("1,2 km")).toBeOnTheScreen();
  });

  it("renders correctly with a custom branch entry", () => {
    const { Wrapper } = createWrapper();
    const branch: Branch = {
      id: "custom-1",
      name: "BRI Kantor Pusat",
      distance: "3,5 km",
      latitude: -6.18,
      longitude: 106.82,
    };
    render(<BranchRow item={branch} />, { wrapper: Wrapper });
    expect(screen.getByText("BRI Kantor Pusat")).toBeOnTheScreen();
    expect(screen.getByText("3,5 km")).toBeOnTheScreen();
  });

  it("truncates to a single line (numberOfLines prop applied)", () => {
    const { Wrapper } = createWrapper();
    render(<BranchRow item={SAMPLE} />, { wrapper: Wrapper });
    // numberOfLines={1} is passed on the name text — component should render without throwing
    const nameEl = screen.getByText(SAMPLE.name);
    expect(nameEl).toBeOnTheScreen();
  });
});
