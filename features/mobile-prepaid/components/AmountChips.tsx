import React, { memo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { useTranslation } from "@/core/i18n";
import { Colors, Fonts, Radius } from "@/constants/theme";
import type { PrepaidAmountOption } from "../types";

interface AmountChipsProps {
  amounts: PrepaidAmountOption[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

function AmountChipsComponent({ amounts, selectedValue, onSelect }: AmountChipsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{t("mobilePrepaid.chooseAmount")}</ThemedText>
      <View style={styles.row}>
        {amounts.map((option) => {
          const isActive = selectedValue === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(option.value)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isActive }}
            >
              <ThemedText style={[styles.chipText, isActive && styles.chipTextActive]}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const AmountChips = memo(AmountChipsComponent);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textBlack,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  chip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.textBlack,
  },
  chipTextActive: {
    color: Colors.white,
  },
});
