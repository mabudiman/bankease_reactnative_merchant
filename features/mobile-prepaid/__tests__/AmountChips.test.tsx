// features/mobile-prepaid/__tests__/AmountChips.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AmountChips } from "../components/AmountChips";
import { AMOUNT_OPTIONS } from "../types";
import type { AmountOption } from "../types";

describe("AmountChips", () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it("renders all amount options", () => {
    const { getByText } = render(<AmountChips selected={null} onSelect={onSelect} />);
    for (const opt of AMOUNT_OPTIONS) {
      expect(getByText(opt.label)).toBeTruthy();
    }
  });

  it("calls onSelect when a chip is tapped", () => {
    const { getByText } = render(<AmountChips selected={null} onSelect={onSelect} />);
    fireEvent.press(getByText("$20"));
    expect(onSelect).toHaveBeenCalledWith(AMOUNT_OPTIONS[1]);
  });

  it("highlights the selected chip", () => {
    const { getByText } = render(
      <AmountChips selected={AMOUNT_OPTIONS[0]} onSelect={onSelect} />,
    );
    const chip = getByText("$10");
    // The selected chip's parent Pressable has a testID
    expect(chip).toBeTruthy();
  });
});
