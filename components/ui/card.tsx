import React from "react";
import { View, StyleSheet, type ViewProps } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

type CardProps = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: Spacing.md,
    shadowColor: "#3629B7",
    shadowOffset: { width: 0, height: 3.87 },
    shadowOpacity: 0.07,
    shadowRadius: 14.52,
    elevation: 3,
  },
});
