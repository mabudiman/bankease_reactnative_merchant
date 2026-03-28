import React from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { ThemedButton, type ThemedButtonProps } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius } from "@/constants/theme";

type PrimaryButtonProps = Omit<
  ThemedButtonProps,
  "variant" | "lightColor" | "darkColor" | "style"
> & {
  marginTop?: number;
  marginBottom?: number;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  marginTop = Spacing.lg,
  marginBottom = Spacing.lg,
  disabled,
  style,
  ...buttonProps
}: PrimaryButtonProps) {
  const color = disabled ? Colors.buttonDisabled : Colors.primary;

  return (
    <View style={[styles.container, { marginTop, marginBottom }]}>
      <ThemedButton
        variant="primary"
        disabled={disabled}
        lightColor={color}
        darkColor={color}
        style={[styles.button, style]}
        {...buttonProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    width: "100%",
    borderRadius: Radius.md,
    minHeight: 52,
  },
});
