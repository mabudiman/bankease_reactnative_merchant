import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ComponentProps } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Fonts, Radius } from "@/constants/theme";

type IconSymbolName = ComponentProps<typeof IconSymbol>["name"];

type Props = {
  readonly focused: boolean;
  readonly color: string;
  readonly iconName: IconSymbolName;
  readonly label: string;
};

export function FocusedTabIcon({ focused, color, iconName, label }: Props) {
  if (focused) {
    return (
      <View style={styles.pill}>
        <IconSymbol size={18} name={iconName} color={Colors.white} />
        <Text style={styles.label}>{label}</Text>
      </View>
    );
  }
  return <IconSymbol size={24} name={iconName} color={color} />;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
  },
  label: {
    color: Colors.white,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});
