import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { ExchangeRate } from "../types";
import { FLAG_FALLBACK, FLAG_MAP } from "./flagMap";

type Props = {
  item: ExchangeRate;
};

export const ExchangeRateRow = memo(function ExchangeRateRow({ item }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.flagCircle}>
        <Image
          source={FLAG_MAP[item.countryCode] ?? FLAG_FALLBACK}
          style={styles.flagImage}
        />
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
    marginRight: Spacing.sm,
  },
  flagImage: {
    width: 36,
    height: 24,
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
