import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { createWrapper } from "@/test-utils/createWrapper";
import { BeneficiaryDirectory } from "../BeneficiaryDirectory";
import { MOCK_BENEFICIARIES } from "@/mocks/data";

describe("BeneficiaryDirectory", () => {
  const onSelect = jest.fn();
  const onAdd = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all beneficiary names", () => {
    const { Wrapper } = createWrapper();
    render(
      <BeneficiaryDirectory
        beneficiaries={MOCK_BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
        onAdd={onAdd}
      />,
      { wrapper: Wrapper },
    );
    for (const ben of MOCK_BENEFICIARIES) {
      expect(screen.getByText(ben.name)).toBeOnTheScreen();
    }
  });

  it("renders the add button", () => {
    const { Wrapper } = createWrapper();
    render(
      <BeneficiaryDirectory
        beneficiaries={MOCK_BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
        onAdd={onAdd}
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText("Add beneficiary")).toBeOnTheScreen();
  });

  it("calls onAdd when add button is pressed", () => {
    const { Wrapper } = createWrapper();
    render(
      <BeneficiaryDirectory
        beneficiaries={MOCK_BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
        onAdd={onAdd}
      />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText("Add beneficiary"));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect when a beneficiary is pressed", () => {
    const { Wrapper } = createWrapper();
    render(
      <BeneficiaryDirectory
        beneficiaries={MOCK_BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
        onAdd={onAdd}
      />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText(MOCK_BENEFICIARIES[0].name));
    expect(onSelect).toHaveBeenCalledWith(MOCK_BENEFICIARIES[0]);
  });

  it("renders directory and find beneficiary labels", () => {
    const { Wrapper } = createWrapper();
    render(
      <BeneficiaryDirectory
        beneficiaries={MOCK_BENEFICIARIES}
        selectedId={null}
        onSelect={onSelect}
        onAdd={onAdd}
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("Directory")).toBeOnTheScreen();
    expect(screen.getByText("Find beneficiary")).toBeOnTheScreen();
  });
});
