import React, { memo } from "react";
import { View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { useTranslation } from "@/core/i18n";
import { Colors, Fonts, Radius } from "@/constants/theme";
import type { Beneficiary } from "../types";

interface BeneficiaryDirectoryProps {
  beneficiaries: Beneficiary[];
  selectedId: string | null;
  onSelect: (beneficiary: Beneficiary) => void;
  onAdd: () => void;
}

function BeneficiaryDirectoryComponent({
  beneficiaries,
  selectedId,
  onSelect,
  onAdd,
}: BeneficiaryDirectoryProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label}>{t("mobilePrepaid.directory")}</ThemedText>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t("mobilePrepaid.findBeneficiary")}
        >
          <ThemedText style={styles.findLink}>
            {t("mobilePrepaid.findBeneficiary")}
          </ThemedText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          style={styles.addButton}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add beneficiary"
        >
          <View style={styles.addCircle}>
            <Ionicons name="add" size={28} color="#C7C7CC" />
          </View>
        </Pressable>

        {beneficiaries.map((ben) => {
          const isSelected = selectedId === ben.id;
          return (
            <Pressable
              key={ben.id}
              style={styles.beneficiaryItem}
              onPress={() => onSelect(ben)}
              accessibilityRole="button"
              accessibilityLabel={ben.name}
            >
              <View style={[styles.avatarWrapper, isSelected && styles.avatarSelected]}>
                {ben.avatarUrl ? (
                  <Image source={{ uri: ben.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={28} color={Colors.white} />
                  </View>
                )}
              </View>
              <ThemedText style={styles.name} numberOfLines={1}>
                {ben.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const BeneficiaryDirectory = memo(BeneficiaryDirectoryComponent);

const AVATAR_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textBlack,
  },
  findLink: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 8,
  },
  addButton: {
    alignItems: "center",
    width: 70,
  },
  addCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  beneficiaryItem: {
    alignItems: "center",
    width: 70,
  },
  avatarWrapper: {
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarSelected: {
    borderColor: Colors.primary,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textBlack,
    marginTop: 4,
    textAlign: "center",
  },
});
