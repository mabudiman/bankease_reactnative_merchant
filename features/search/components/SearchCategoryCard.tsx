import React, { memo } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";

type Props = {
  title: string;
  subtitle: string;
  illustration: ImageSourcePropType;
  onPress?: () => void;
};

export const SearchCategoryCard = memo(function SearchCategoryCard({
  title,
  subtitle,
  illustration,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={illustration}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    filter: [{ dropShadow: { offsetX: 0, offsetY: 6, standardDeviation: 6, color: "rgba(0,0,0,0.04)" } }],
  },
  cardPressed: {
    opacity: 0.85,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textBlack,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  illustrationContainer: {
    width: 100,
    height: 80,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
    overflow: "hidden",
  },
  illustrationImage: {
    width: 90,
    height: 70,
  },
});
