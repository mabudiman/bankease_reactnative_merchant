import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { ExchangeRate } from "../types";

type Props = {
  item: ExchangeRate;
};

export const ExchangeRateRow = memo(function ExchangeRateRow({ item }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.flagCircle}>
        <Text style={styles.flagText}>{item.flag}</Text>
      </View>
      <ThemedText style={styles.country}>{item.country}</ThemedText>
      <ThemedText style={styles.value}>{item.buy}</ThemedText>
      <ThemedText style={styles.value}>{item.sell}</ThemedText>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  flagCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  flagText: {
    fontSize: 20,
  },
  country: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textBlack,
  },
  value: {
    width: 60,
    textAlign: "right",
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textBlack,
  },
});
