// features/mobile-prepaid/components/BeneficiaryDirectory.tsx
import React, { memo, useMemo, useCallback } from "react";
import { View, ScrollView, Pressable, Image, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import type { Beneficiary } from "../types";

interface BeneficiaryDirectoryProps {
  beneficiaries: Beneficiary[];
  selectedId: string | null;
  onSelect: (beneficiary: Beneficiary) => void;
}

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ─── Memoised item — only re-renders when its own isSelected changes ─────────

interface BeneficiaryItemProps {
  readonly ben: Beneficiary;
  readonly isSelected: boolean;
  readonly onSelect: (ben: Beneficiary) => void;
}

const BeneficiaryItem = memo(function BeneficiaryItem({
  ben,
  isSelected,
  onSelect,
}: BeneficiaryItemProps) {
  const source = useMemo(() => (ben.avatar ? { uri: ben.avatar } : null), [ben.avatar]);
  const handlePress = useCallback(() => onSelect(ben), [onSelect, ben]);

  return (
    <Pressable
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={ben.name}
      accessibilityState={{ selected: isSelected }}
    >
      {source ? (
        <Image source={source} style={styles.avatar} fadeDuration={0} />
      ) : (
        <View style={styles.avatarFallback}>
          <ThemedText style={styles.avatarInitial}>{getInitials(ben.name)}</ThemedText>
        </View>
      )}
      <ThemedText
        style={[styles.name, isSelected && styles.nameSelected]}
        numberOfLines={1}
      >
        {ben.name}
      </ThemedText>
    </Pressable>
  );
});

function BeneficiaryDirectoryComponent({
  beneficiaries,
  selectedId,
  onSelect,
}: BeneficiaryDirectoryProps) {
  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionLabel}>Directory</ThemedText>
        <Pressable onPress={() => Alert.alert("Coming Soon")} accessibilityRole="button">
          <ThemedText style={styles.findLink}>Find beneficiary</ThemedText>
        </Pressable>
      </View>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* Add button */}
        <Pressable
          style={styles.card}
          onPress={() => Alert.alert("Coming Soon")}
          accessibilityRole="button"
          accessibilityLabel="Add beneficiary"
        >
          <View style={styles.addCircle}>
            <Ionicons name="add" size={22} color={Colors.white} />
          </View>
        </Pressable>

        {/* Beneficiary items */}
        {beneficiaries.map((b) => (
          <BeneficiaryItem
            key={b.id}
            ben={b}
            isSelected={selectedId === b.id}
            onSelect={onSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const BeneficiaryDirectory = memo(BeneficiaryDirectoryComponent);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: "#989898",
  },
  findLink: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: Colors.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 4,
  },
  card: {
    width: 110,
    height: 120,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
    filter: [
      {
        dropShadow: {
          offsetX: 0,
          offsetY: 8,
          standardDeviation: 8,
          color: "rgba(0,0,0,0.06)",
        },
      },
    ],
  },
  cardSelected: {
    borderColor: Colors.primary,
  },
  addCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F2F1F9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0E0E0",
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#687076",
  },
  name: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#555",
    textAlign: "center",
  },
  nameSelected: {
    color: Colors.primary,
    fontFamily: "Poppins_600SemiBold",
  },
});
