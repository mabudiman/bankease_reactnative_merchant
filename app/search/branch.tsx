import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "@/core/i18n";
import { ThemedText } from "@/components/ui/themed-text";
import { LoadingState } from "@/components/feedback/loadingState";
import { ErrorState } from "@/components/feedback/errorState";
import { BranchRow } from "@/features/search/components/BranchRow";
import { useBranches } from "@/features/search/hooks";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import type { Branch } from "@/features/search/types";

const JAKARTA_REGION = {
  latitude: -6.2,
  longitude: 106.816,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function BranchScreen() {
  const { t } = useTranslation();
  const ts = (key: string) => t(`searchScreen.${key}`);

  const { height: screenHeight } = useWindowDimensions();
  const PANEL_EXPANDED_HEIGHT = screenHeight * 0.5;
  const COLLAPSED_VISIBLE = 96;
  const MAX_TRANSLATE = PANEL_EXPANDED_HEIGHT - COLLAPSED_VISIBLE;

  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(
        0,
        Math.min(startY.value + e.translationY, MAX_TRANSLATE)
      );
    })
    .onEnd(() => {
      translateY.value = withSpring(
        translateY.value > MAX_TRANSLATE / 2 ? MAX_TRANSLATE : 0,
        { damping: 50, stiffness: 300 }
      );
    });

  const animatedPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, isError, refetch } = useBranches(debouncedQuery);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const coordinates = data.map((b: Branch) => ({
      latitude: b.latitude,
      longitude: b.longitude,
    }));
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 160, right: 140, bottom: 340, left: 140 },
      animated: true,
    });
  }, [data]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 300);
  }, []);

  const handleClear = useCallback(() => {
    setSearchText("");
    setDebouncedQuery("");
  }, []);

  function renderBranchList() {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={t("common.error")} onRetry={refetch} recoverable />;
    return (
      <FlatList
        data={data}
        keyExtractor={(item: Branch) => item.id}
        renderItem={({ item }) => <BranchRow item={item} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Branch</ThemedText>
      </SafeAreaView>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map} initialRegion={JAKARTA_REGION} showsUserLocation>
          {data?.map((branch: Branch) => (
            <Marker
              key={branch.id}
              coordinate={{ latitude: branch.latitude, longitude: branch.longitude }}
              title={branch.name}
            >
              <Ionicons name="location" size={32} color={Colors.primary} />
            </Marker>
          ))}
        </MapView>

      {/* Bottom panel */}
      <Animated.View style={[styles.panel, { height: PANEL_EXPANDED_HEIGHT }, animatedPanelStyle]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.panelHeader}>
            <View style={styles.dragHandle} />

            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={18}
                color={Colors.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={handleSearchChange}
                placeholder={ts("searchBranchPlaceholder")}
                placeholderTextColor={Colors.textMuted}
                returnKeyType="search"
                autoCorrect={false}
              />
              {searchText.length > 0 && (
                <Pressable onPress={handleClear} accessibilityRole="button" accessibilityLabel="Clear search">
                  <Ionicons name="close" size={18} color={Colors.textMuted} />
                </Pressable>
              )}
            </View>
          </View>
        </GestureDetector>

        {renderBranchList()}
      </Animated.View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textBlack,
    marginLeft: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingTop: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  panelHeader: {
    paddingBottom: Spacing.sm,
  },
  dragHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D4D4D4",
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textBlack,
    padding: 0,
  },
});
