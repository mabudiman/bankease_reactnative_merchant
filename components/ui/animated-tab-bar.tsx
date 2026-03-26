import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Fonts } from "@/constants/theme";

const PILL_COLOR = "#3D2C8D";
const INACTIVE_ICON_COLOR = "#9E9E9E";
const TAB_HEIGHT = 60;

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

const ROUTE_ICON_MAP: Record<string, IconName> = {
  index: "home",
  search: "search",
  messages: "mail",
  settings: "settings",
};

// ─── AnimatedTabItem ────────────────────────────────────────────────────────

type TabItemProps = {
  isFocused: boolean;
  label: string;
  iconName: IconName;
  onPress: () => void;
  accessibilityLabel?: string;
};

function AnimatedTabItem({
  isFocused,
  label,
  iconName,
  onPress,
  accessibilityLabel,
}: TabItemProps) {
  const animValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  }, [isFocused, animValue]);

  const iconOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const pillScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Pressable
      style={styles.tabItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {/* Gray icon layer — fades out as pill comes in */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.iconLayer, { opacity: iconOpacity }]}
        pointerEvents="none"
      >
        <MaterialIcons name={iconName} size={22} color={INACTIVE_ICON_COLOR} />
      </Animated.View>

      {/* Pill layer — springs in, always in the render tree */}
      <Animated.View
        style={[
          styles.pill,
          {
            transform: [{ scale: pillScale }],
            opacity: animValue,
          },
        ]}
        pointerEvents="none"
      >
        <MaterialIcons name={iconName} size={18} color="#FFFFFF" />
        <Text style={styles.pillLabel} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── AnimatedTabBar ─────────────────────────────────────────────────────────

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.title === "string" ? options.title : route.name;
        const isFocused = state.index === index;
        const iconName: IconName =
          ROUTE_ICON_MAP[route.name] ?? "circle";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <AnimatedTabItem
            key={route.key}
            isFocused={isFocused}
            label={label}
            iconName={iconName}
            onPress={onPress}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          />
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  tabItem: {
    flex: 1,
    height: TAB_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  iconLayer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PILL_COLOR,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  pillLabel: {
    color: "#FFFFFF",
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
