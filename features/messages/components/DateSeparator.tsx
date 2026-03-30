import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";

interface Props {
  label: string;
}

export function DateSeparator({ label }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: 12,
    color: "#AAAAAA",
  },
});
