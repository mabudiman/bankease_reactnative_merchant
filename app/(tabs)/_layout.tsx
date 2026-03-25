import { Tabs } from "expo-router";
import React, { useMemo, useCallback } from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

import { HapticTab } from "@/components/ui/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/core/i18n";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const screenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
      tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
      headerShown: false,
      tabBarButton: HapticTab,
    }),
    [colorScheme],
  );

  const homeIcon = useCallback(
    ({ color }: { color: string }) => (
      <IconSymbol size={28} name="house.fill" color={color} />
    ),
    [],
  );

  const accountsIcon = useCallback(
    ({ color }: { color: string }) => (
      <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
    ),
    [],
  );

  const homeTabBarButton = useCallback(
    (props: BottomTabBarButtonProps) => <HapticTab {...props} testID="tab-home" />,
    [],
  );

  const accountsTabBarButton = useCallback(
    (props: BottomTabBarButtonProps) => <HapticTab {...props} testID="tab-accounts" />,
    [],
  );

  const indexOptions = useMemo(
    () => ({
      title: t("common.home"),
      tabBarIcon: homeIcon,
      tabBarButton: homeTabBarButton,
    }),
    [t, homeIcon, homeTabBarButton],
  );

  const accountsOptions = useMemo(
    () => ({
      title: t("common.accounts"),
      tabBarIcon: accountsIcon,
      tabBarButton: accountsTabBarButton,
    }),
    [t, accountsIcon, accountsTabBarButton],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={indexOptions} />
      <Tabs.Screen name="accounts" options={accountsOptions} />
    </Tabs>
  );
}
