import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius, Fonts } from "@/constants/theme";
import { useTranslation } from "@/core/i18n";

function handleResend() {
  // TODO: re-trigger OTP SMS API
}

export function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const [code, setCode] = useState("");

  const isCodeValid = code.trim().length >= 4;

  function handleChangePassword() {
    if (!isCodeValid) return;
    router.push("/change-password");
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
              </Pressable>
              <ThemedText style={styles.headerTitle}>{t("forgotPassword")}</ThemedText>
            </View>

            {/* OTP Card */}
            <View style={styles.card}>
              <ThemedText style={styles.label}>{t("typeACode")}</ThemedText>

              <View style={styles.otpRow}>
                <TextInput
                  style={styles.codeInput}
                  placeholder={t("codePlaceholder")}
                  placeholderTextColor={Colors.placeholderText}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                  accessibilityLabel="OTP code input"
                  returnKeyType="done"
                />
                <Pressable
                  style={styles.resendButton}
                  onPress={handleResend}
                  accessibilityRole="button"
                  accessibilityLabel="Resend code"
                >
                  <ThemedText style={styles.resendText}>{t("resend")}</ThemedText>
                </Pressable>
              </View>

              <ThemedText style={styles.helperText}>
                {t("otpHelperPrefix")}
                <ThemedText style={styles.phoneHighlight}>(+84) 0398829xxx</ThemedText>
              </ThemedText>

              <ThemedText style={styles.expiryText}>{t("otpExpiry")}</ThemedText>

              {/* Change Password Button */}
              <ThemedButton
                title={t("changePassword")}
                variant="primary"
                disabled={!isCodeValid}
                onPress={handleChangePassword}
                style={styles.submitButton}
                lightColor={isCodeValid ? Colors.primary : Colors.buttonDisabled}
                darkColor={isCodeValid ? Colors.primary : Colors.buttonDisabled}
                lightTextColor={isCodeValid ? Colors.white : Colors.buttonDisabledText}
                darkTextColor={isCodeValid ? Colors.white : Colors.buttonDisabledText}
                accessibilityLabel="Change password"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.textBlack,
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },

  // OTP Row
  otpRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  codeInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
    backgroundColor: Colors.cardBackground,
  },
  resendButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  resendText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.white,
  },

  // Helper text
  helperText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  phoneHighlight: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
  expiryText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Button
  submitButton: {
    width: "100%",
    borderRadius: Radius.md,
    minHeight: 52,
    marginTop: Spacing.lg,
  },
});
