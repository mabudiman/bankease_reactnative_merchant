import React from "react";
import { View } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { SelectorInput } from "../selector-input";
import { createWrapper } from "@/test-utils/createWrapper";

// Simulate native measure so openModal fires the callback synchronously
beforeAll(() => {
  jest
    .spyOn(View.prototype, "measure")
    .mockImplementation(
      (
        callback: (
          x: number,
          y: number,
          w: number,
          h: number,
          px: number,
          py: number,
        ) => void,
      ) => {
        callback(0, 0, 200, 40, 0, 100);
      },
    );
});

afterAll(() => {
  jest.restoreAllMocks();
});

const OPTIONS = ["opt-1", "opt-2", "opt-3"];
const OPTION_LABELS = ["Option One", "Option Two", "Option Three"];

function renderSelector(props: Partial<React.ComponentProps<typeof SelectorInput>> = {}) {
  const { Wrapper } = createWrapper();
  const onSelectOption = jest.fn();
  render(
    <SelectorInput
      selectedOption=""
      options={OPTIONS}
      optionLabels={OPTION_LABELS}
      onSelectOption={onSelectOption}
      {...props}
    />,
    { wrapper: Wrapper },
  );
  return { onSelectOption };
}

describe("SelectorInput", () => {
  // ── Rendering ────────────────────────────────────────────────────────────

  it("renders placeholder when nothing is selected", () => {
    renderSelector({ placeholder: "Choose one" });
    expect(screen.getByText("Choose one")).toBeOnTheScreen();
  });

  it("renders the selected option label when an option is selected", () => {
    renderSelector({ selectedOption: "opt-2" });
    expect(screen.getByText("Option Two")).toBeOnTheScreen();
  });

  it("renders the selected option value when no optionLabels provided", () => {
    renderSelector({ selectedOption: "opt-1", optionLabels: undefined });
    expect(screen.getByText("opt-1")).toBeOnTheScreen();
  });

  it("renders a label above the selector when label prop is given", () => {
    renderSelector({ label: "Payment method" });
    expect(screen.getByText("Payment method")).toBeOnTheScreen();
  });

  it("does not render a label element when label prop is omitted", () => {
    renderSelector({ label: undefined });
    expect(screen.queryByText("Payment method")).toBeNull();
  });

  it("renders the modal title when modalTitle is provided and modal is open", () => {
    renderSelector({ modalTitle: "Select Option" });
    fireEvent.press(screen.getByLabelText("Select, current: "));
    expect(screen.getByText("Select Option")).toBeOnTheScreen();
  });

  // ── Interaction ──────────────────────────────────────────────────────────

  it("pressing the selector triggers the accessibility role button", () => {
    renderSelector({ placeholder: "Pick" });
    const trigger = screen.getByLabelText("Select, current: ");
    expect(trigger).toBeOnTheScreen();
    fireEvent.press(trigger);
  });

  it("shows option labels in the modal after pressing", () => {
    renderSelector();
    fireEvent.press(screen.getByLabelText("Select, current: "));
    expect(screen.getByText("Option One")).toBeOnTheScreen();
    expect(screen.getByText("Option Two")).toBeOnTheScreen();
    expect(screen.getByText("Option Three")).toBeOnTheScreen();
  });

  it("calls onSelectOption with the chosen value when inside the modal", () => {
    const { onSelectOption } = renderSelector();
    fireEvent.press(screen.getByLabelText("Select, current: "));
    fireEvent.press(screen.getByText("Option Two"));
    expect(onSelectOption).toHaveBeenCalledWith("opt-2");
  });

  it("closes the modal after selecting an option", () => {
    renderSelector();
    fireEvent.press(screen.getByLabelText("Select, current: "));
    fireEvent.press(screen.getByText("Option One"));
    expect(screen.queryByText("Option Two")).toBeNull();
  });

  it("closes the modal when the close button is pressed", () => {
    const { UNSAFE_getAllByType } = render(
      <SelectorInput
        selectedOption=""
        options={OPTIONS}
        optionLabels={OPTION_LABELS}
        onSelectOption={jest.fn()}
        modalTitle="Pick"
      />,
    );
    fireEvent.press(screen.getByLabelText("Select, current: "));
    expect(screen.getByText("Pick")).toBeOnTheScreen();
    // Trigger modal's onRequestClose to invoke onClose → setModalVisible(false)
    const { Modal } = require("react-native");
    const modals = UNSAFE_getAllByType(Modal);
    fireEvent(modals[0], "onRequestClose");
    expect(screen.queryByText("Option One")).toBeNull();
  });
});
