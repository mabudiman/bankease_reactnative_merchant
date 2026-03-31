import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { createWrapper } from "@/test-utils/createWrapper";
import { AmountChips } from "../AmountChips";
import { MOCK_PREPAID_AMOUNTS } from "@/mocks/data";

describe("AmountChips", () => {
  const onSelect = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all amount options", () => {
    const { Wrapper } = createWrapper();
    render(
      <AmountChips
        amounts={MOCK_PREPAID_AMOUNTS}
        selectedValue={null}
        onSelect={onSelect}
      />,
      { wrapper: Wrapper },
    );
    for (const option of MOCK_PREPAID_AMOUNTS) {
      expect(screen.getByText(option.label)).toBeOnTheScreen();
    }
  });

  it("calls onSelect with correct value when chip is pressed", () => {
    const { Wrapper } = createWrapper();
    render(
      <AmountChips
        amounts={MOCK_PREPAID_AMOUNTS}
        selectedValue={null}
        onSelect={onSelect}
      />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByText("$10"));
    expect(onSelect).toHaveBeenCalledWith(1000);
  });

  it("marks the selected chip as selected", () => {
    const { Wrapper } = createWrapper();
    render(
      <AmountChips
        amounts={MOCK_PREPAID_AMOUNTS}
        selectedValue={1000}
        onSelect={onSelect}
      />,
      { wrapper: Wrapper },
    );
    const chip = screen.getByLabelText("$10");
    expect(chip.props.accessibilityState).toMatchObject({ selected: true });
  });

  it("marks non-selected chips as not selected", () => {
    const { Wrapper } = createWrapper();
    render(
      <AmountChips
        amounts={MOCK_PREPAID_AMOUNTS}
        selectedValue={1000}
        onSelect={onSelect}
      />,
      { wrapper: Wrapper },
    );
    const chip = screen.getByLabelText("$20");
    expect(chip.props.accessibilityState).toMatchObject({ selected: false });
  });
});
