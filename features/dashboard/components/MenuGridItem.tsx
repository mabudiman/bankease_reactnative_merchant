import React, { memo } from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ui/themed-text";
import { useTranslation } from "@/core/i18n";
import type { Privilege } from "../types";
import { Colors } from '@/constants/theme';

interface MenuGridItemProps {
  readonly privilege: Privilege;
}

// Map normalized menu title → app route
// Normalize: uppercase + replace spaces with underscores
const ROUTE_MAP: Partial<Record<string, string>> = {
  WITHDRAW: "/withdraw",
  TARIK_TUNAI: "/withdraw",
  TRANSFER: "/transfer",
};

function normalizeTitle(title: string): string {
  return title.toUpperCase().replaceAll(/\s+/g, '_');
}

function MenuGridItemComponent({ privilege }: MenuGridItemProps) {
  const { t } = useTranslation();
  const router = useRouter();

  function handlePress() {
    const normalized = normalizeTitle(privilege.title);
    const route = ROUTE_MAP[normalized];
    console.log('[MenuGridItem] pressed:', privilege.title, '→ normalized:', normalized, '→ route:', route);
    if (route) {
      router.push(route as any);
      return;
    }
    Alert.alert(t("dashboard.comingSoon.title"), t("dashboard.comingSoon.message"));
  }

  return (
    <Pressable
      style={({ pressed }) => {
        /* istanbul ignore next */
        return [styles.card, pressed && styles.cardPressed];
      }}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={privilege.title}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={privilege.icon as React.ComponentProps<typeof Ionicons>["name"]}
          size={26}
          color={privilege.color}
        />
      </View>
      <ThemedText style={styles.label} numberOfLines={2}>
        {privilege.title}
      </ThemedText>
    </Pressable>
  );
}

export const MenuGridItem = memo(MenuGridItemComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: Colors.shadowGrid,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 14,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    color: Colors.textMenu,
    lineHeight: 18,
  },
});
