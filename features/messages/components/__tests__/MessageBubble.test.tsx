import React from "react";
import { render, screen } from "@testing-library/react-native";
import { MessageBubble } from "../MessageBubble";
import { createWrapper } from "@/test-utils/createWrapper";
import type { ThreadMessage } from "@/features/messages/types";

const RECEIVED_MSG: ThreadMessage = {
  id: "m1",
  text: "Hello from the bank",
  type: "received",
  date: "2018-08-10T09:00:00.000Z",
};

const SENT_MSG: ThreadMessage = {
  id: "m2",
  text: "Thanks!",
  type: "sent",
  date: "2018-08-10T09:05:00.000Z",
};

describe("MessageBubble", () => {
  it("renders the message text for a received bubble", () => {
    const { Wrapper } = createWrapper();
    render(<MessageBubble message={RECEIVED_MSG} />, { wrapper: Wrapper });
    expect(screen.getByText(RECEIVED_MSG.text)).toBeOnTheScreen();
  });

  it("renders the message text for a sent bubble", () => {
    const { Wrapper } = createWrapper();
    render(<MessageBubble message={SENT_MSG} />, { wrapper: Wrapper });
    expect(screen.getByText(SENT_MSG.text)).toBeOnTheScreen();
  });

  it("renders received bubble without throwing", () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<MessageBubble message={RECEIVED_MSG} />, { wrapper: Wrapper })
    ).not.toThrow();
  });

  it("renders sent bubble without throwing", () => {
    const { Wrapper } = createWrapper();
    expect(() =>
      render(<MessageBubble message={SENT_MSG} />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
