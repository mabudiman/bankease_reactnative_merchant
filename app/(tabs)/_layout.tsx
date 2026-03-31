import { Tabs } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import HomeIcon from '@/assets/svgs/home.svg';
import SearchIcon from '@/assets/svgs/search.svg';
import InboxIcon from '@/assets/svgs/inbox.svg';
import SettingsIcon from '@/assets/svgs/settings.svg';

const TAB_ICONS = {
  index: HomeIcon,
  search: SearchIcon,
  messages: InboxIcon,
  settings: SettingsIcon,
} as const;

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  search: 'Search',
  messages: 'Messages',
  settings: 'Settings',
};

function FloatingTabBar({ state, navigation }: Readonly<BottomTabBarProps>) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = state.routes.filter((r) => TAB_LABELS[r.name]);

  return (
    <View style={[S.barWrapper, { bottom: insets.bottom + 12 }]}>
      <View style={S.bar}>
        {visibleRoutes.map((route) => {
          const focused = state.index === state.routes.indexOf(route);
          const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          const label = TAB_LABELS[route.name];

          const onPress = () => {
            if (process.env.EXPO_OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={S.tabButton}
            >
              {focused ? (
                <View style={S.pill}>
                  <Icon width={18} height={18} color='#FFFFFF' />
                  <Text style={S.pillLabel}>{label}</Text>
                </View>
              ) : (
                <Icon width={24} height={24} color='#9E9EAE' />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={FloatingTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="settings" />
      <Tabs.Screen name="accounts" options={{ href: null }} />
    </Tabs>
  );
}

const S = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: Colors.primary,
  },
  pillLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
