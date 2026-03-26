import { Tabs } from "expo-router";
import React from "react";

import { AnimatedTabBar } from "@/components/ui/animated-tab-bar";
import { useTranslation } from "@/core/i18n";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={AnimatedTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("common.home") }} />
      <Tabs.Screen name="search" options={{ title: t("common.search") }} />
      <Tabs.Screen name="messages" options={{ title: t("common.messages") }} />
      <Tabs.Screen name="settings" options={{ title: t("common.settings") }} />
    </Tabs>
  );
}

