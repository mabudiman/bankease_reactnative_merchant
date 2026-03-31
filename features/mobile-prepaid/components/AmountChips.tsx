// features/mobile-prepaid/components/AmountChips.tsx
import React, { memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { AMOUNT_OPTIONS } from "../types";
import type { AmountOption } from "../types";

interface AmountChipsProps {
  selected: AmountOption | null;
  onSelect: (option: AmountOption) => void;
}

function AmountChipsComponent({ selected, onSelect }: AmountChipsProps) {
  return (
    <View style={styles.row}>
      {AMOUNT_OPTIONS.map((option) => {
        const isActive = selected?.value === option.value;
        return (
          <Pressable
            key={option.value}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
          >
            <ThemedText style={[styles.chipText, isActive && styles.chipTextActive]}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export const AmountChips = memo(AmountChipsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#687076",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },
});
