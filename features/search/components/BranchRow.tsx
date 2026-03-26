import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { Branch } from "../types";

type Props = {
  item: Branch;
};

export const BranchRow = memo(function BranchRow({ item }: Props) {
  return (
    <View style={styles.row}>
      <Ionicons
        name="location-outline"
        size={20}
        color={Colors.primary}
        style={styles.icon}
      />
      <ThemedText style={styles.name} numberOfLines={1}>
        {item.name}
      </ThemedText>
      <ThemedText style={styles.distance}>{item.distance}</ThemedText>
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
  icon: {
    marginRight: Spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textBlack,
  },
  distance: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
});
