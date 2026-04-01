import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export interface ChooseAccountFieldProps {
  readonly value?: string;
  readonly placeholder: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

export function ChooseAccountField({
  value,
  placeholder,
  onPress,
  disabled = false,
}: ChooseAccountFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={value ?? placeholder}
      style={styles.container}
    >
      <Text
        style={[styles.label, value ? styles.labelSelected : styles.labelPlaceholder]}
        numberOfLines={1}
      >
        {value ?? placeholder}
      </Text>
      <View style={styles.iconWrapper}>
        <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  labelPlaceholder: {
    color: Colors.textMuted,
  },
  labelSelected: {
    color: Colors.textBlack,
  },
  iconWrapper: {
    marginLeft: Spacing.sm,
  },
});
