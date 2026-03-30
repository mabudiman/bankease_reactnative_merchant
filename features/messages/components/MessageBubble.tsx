import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Fonts, Spacing } from "@/constants/theme";
import type { ThreadMessage } from "../types";

interface Props {
  message: ThreadMessage;
}

export function MessageBubble({ message }: Props) {
  const isSent = message.type === "sent";

  return (
    <View style={[styles.row, isSent ? styles.rowSent : styles.rowReceived]}>
      <View
        style={[
          styles.bubble,
          isSent ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        <ThemedText
          style={[styles.text, isSent ? styles.textSent : styles.textReceived]}
        >
          {message.text}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.md,
    marginVertical: 4,
  },
  rowReceived: {
    alignItems: "flex-start",
  },
  rowSent: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleReceived: {
    backgroundColor: "#F0F0F5",
    borderRadius: 12,
    borderTopLeftRadius: 0,
  },
  bubbleSent: {
    backgroundColor: "#3629B7",
    borderRadius: 12,
    borderTopRightRadius: 0,
    minWidth: 60,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textReceived: {
    color: "#222222",
  },
  textSent: {
    color: "#FFFFFF",
    fontFamily: Fonts.medium,
  },
});
