import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export interface ChooseAmountProps {
  readonly presetAmounts: readonly string[];
  readonly selectedAmount: string | null;
  readonly onSelectAmount: (amount: string) => void;
  readonly allowCustomAmount: boolean;
  readonly customAmount: string;
  readonly onChangeCustomAmount: (value: string) => void;
}

// ─── Module-level sub-components (S6478: no component defs inside component) ─

interface AmountPillProps {
  readonly label: string;
  readonly selected: boolean;
  readonly onPress: () => void;
}

function AmountPill({ label, selected, onPress }: AmountPillProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.pill, selected ? styles.pillSelected : styles.pillDefault]}
    >
      <Text style={[styles.pillText, selected ? styles.pillTextSelected : styles.pillTextDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── ChooseAmount ─────────────────────────────────────────────────────────────

export function ChooseAmount({
  presetAmounts,
  selectedAmount,
  onSelectAmount,
  allowCustomAmount,
  customAmount,
  onChangeCustomAmount,
}: ChooseAmountProps) {
  const isCustomMode = allowCustomAmount && selectedAmount === 'Other';

  if (isCustomMode) {
    const displayValue = customAmount ? `$ ${customAmount}` : '';

    return (
      <TextInput
        style={styles.customInput}
        placeholder="Amount"
        placeholderTextColor={Colors.textMuted}
        value={displayValue}
        keyboardType="numeric"
        onChangeText={(text) => {
          // Strip everything except digits
          const digits = text.replaceAll(/[^\d]/g, '');
          onChangeCustomAmount(digits);
        }}
        accessibilityLabel="Amount"
      />
    );
  }

  // Render 3-column grid of presets
  const rows: string[][] = [];
  for (let i = 0; i < presetAmounts.length; i += 3) {
    rows.push([...presetAmounts].slice(i, i + 3));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={rowIdx} style={styles.row}>
          {row.map((label) => (
            <AmountPill
              key={label}
              label={label}
              selected={selectedAmount === label}
              onPress={() => onSelectAmount(label)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft card: no border, subtle shadow
    borderWidth: 0,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pillDefault: {
     backgroundColor: Colors.white,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  pillText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  pillTextDefault: {
    color: Colors.textMuted,
  },
  pillTextSelected: {
    color: Colors.white,
  },
  customInput: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
    backgroundColor: Colors.white,
  },
});
