import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";

type LabeledInputProps = {
  /** Optional label shown above the input */
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  editable = true,
  style,
}: LabeledInputProps) {
  return (
    <View style={style}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.labelText,
    marginBottom: Spacing.xs,
  },
  input: {
    paddingHorizontal: Spacing.md - 4,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textBlack,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: Radius.md,
    minHeight: 42,
  },
});
