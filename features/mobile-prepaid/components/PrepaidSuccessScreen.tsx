import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { useTranslation } from "@/core/i18n";
import { Colors, Fonts, Spacing } from "@/constants/theme";

export function PrepaidSuccessScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Illustration placeholder */}
          <View style={styles.illustration}>
            <Ionicons name="checkmark-circle" size={100} color={Colors.primary} />
          </View>

          <ThemedText style={styles.title}>{t("mobilePrepaid.success.title")}</ThemedText>
          <ThemedText style={styles.message}>
            {t("mobilePrepaid.success.message")}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ThemedButton
            title={t("mobilePrepaid.confirm")}
            onPress={() => router.replace("/(tabs)")}
            accessibilityLabel={t("mobilePrepaid.confirm")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: 12,
  },
  illustration: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
