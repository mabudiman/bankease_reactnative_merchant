import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { formatMessageDate } from "@/utils/date";
import type { Message } from "../types";

interface Props {
  item: Message;
  todayLabel: string;
  onPress?: () => void;
}

export function MessageItem({ item, todayLabel, onPress }: Props) {
  const dateLabel = formatMessageDate(item.date, todayLabel);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View style={[styles.iconWrapper, { backgroundColor: item.iconColor }]}>
        <Ionicons
          name={item.iconName as keyof typeof Ionicons.glyphMap}
          size={22}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.textBlock}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.preview} numberOfLines={1}>
          {item.preview}
        </ThemedText>
      </View>

      <ThemedText style={styles.date}>{dateLabel}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    filter: [{ dropShadow: { offsetX: 0, offsetY: 6, standardDeviation: 6, color: "rgba(0,0,0,0.04)" } }],
  },
  cardPressed: {
    opacity: 0.85,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: 4,
    marginRight: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textBlack,
  },
  preview: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
    alignSelf: "flex-start",
    marginTop: 2,
  },
});
