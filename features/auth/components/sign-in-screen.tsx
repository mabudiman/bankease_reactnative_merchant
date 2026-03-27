/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius, Fonts } from "@/constants/theme";
import { authService } from "../services/auth-service";
import { profileApi } from "@/features/profile/api/profile-api";
import { ApiError } from "@/core/api/errors";
import { useTranslation } from "@/core/i18n/useTranslation";
import LockIcon from "@/assets/svgs/illustration.svg";
import FingerprintIcon from "@/assets/svgs/fingerprint.svg";

const HERO_SIZE = 155;
const FINGERPRINT_SIZE = 14.27;
const SHEET_INPUT_BORDER = "rgba(0,0,0,0.12)";
const SHEET_INPUT_BG = "rgba(0,0,0,0.03)";
const SHEET_PLACEHOLDER = "#AAAAAA";

function handleBiometric() {
  // Placeholder untuk login biometrik
}

export function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  async function handleSignIn() {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    try {
      await authService.signIn(username, password);

      // Verify profile exists before entering the dashboard
      const session = await authService.getSession();
      if (!session) throw new Error('SESSION_ERROR');
      await profileApi.getProfile(session.accountId);

      router.replace("/(tabs)");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        await authService.clearSession();
        Alert.alert(
          'Profile Not Found',
          'Your profile was not found. Please contact support.',
        );
      } else if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
        Alert.alert('Failed', 'Username or password is incorrect.');
      } else {
        await authService.clearSession();
        Alert.alert('Failed', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.flex}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* ── Header (purple) ── */}
              <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                  <Pressable
                    style={styles.backButton}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                  >
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={Colors.white}
                    />
                  </Pressable>
                  <ThemedText type='title' style={styles.headerTitle}>
                    {t("signIn.title")}
                  </ThemedText>
                </View>
                <View style={styles.headerTextContainer}>
                  <ThemedText type='caption' style={styles.headerSubtitle}>
                    {t("signIn.subtitle")}
                  </ThemedText>
                </View>
              </View>

              {/* ── Hero (purple) ── */}
              <View style={styles.heroSection}>
                <LockIcon
                  width={HERO_SIZE * 1.5}
                  height={HERO_SIZE * 1.5}
                  accessibilityLabel="Security illustration"
                />
              </View>

              {/* ── Phone + Password input (purple area) ── */}
              <View style={styles.phoneSection}>
                <View style={styles.purpleInputWrapper}>
                  <TextInput
                    style={styles.purpleInput}
                    placeholder={t("signIn.usernamePlaceholder")}
                    placeholderTextColor={Colors.placeholderText}
                    keyboardType='default'
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={username}
                    onChangeText={setUsername}
                    accessibilityLabel='Username input'
                    returnKeyType='next'
                  />
                </View>
                <View style={styles.passwordFloating}>
                  <View
                    style={[
                      styles.purpleInputWrapper,
                      styles.passwordRow,
                      { marginTop: Spacing.md },
                    ]}
                  >
                    <TextInput
                      style={[styles.purpleInput, styles.passwordInput]}
                      placeholder="Password"
                      placeholderTextColor={Colors.placeholderText}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoCapitalize='none'
                      autoCorrect={false}
                      accessibilityLabel="Password input"
                      returnKeyType="done"
                      onSubmitEditing={handleSignIn}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.passwordToggle}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "chevron-down"}
                        size={18}
                        color={Colors.placeholderText}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* ── White Panel — starts halfway through password input ── */}
              <View style={styles.whitePanel}>
                {/* Forgot password */}
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => router.push("/forgot-password" as any)}
                >
                  <ThemedText type="caption" style={styles.forgotText}>
                    {t("signIn.forgotPassword")}
                  </ThemedText>
                </TouchableOpacity>

                {/* Sign In Button */}
                <ThemedButton
                  title="Sign in"
                  variant="primary"
                  loading={isLoading}
                  disabled={!isFormValid}
                  onPress={handleSignIn}
                  style={[styles.signInButton, { borderRadius: Radius.md }]}
                  accessibilityLabel="Sign in"
                  lightColor={isFormValid ? "#3629B7" : "#D1D5DB"}
                  darkColor={isFormValid ? "#3629B7" : "#4B5563"}
                  lightTextColor="#FFFFFF"
                  darkTextColor="#FFFFFF"
                />

                {/* Fingerprint / Biometric */}
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometric}
                  accessibilityRole="button"
                  accessibilityLabel="Login with biometric"
                >
                  <FingerprintIcon
                    width={FINGERPRINT_SIZE * 6}
                    height={FINGERPRINT_SIZE * 6}
                    accessibilityLabel="Fingerprint icon"
                  />
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.footerTopRow}>
                    <ThemedText type="caption" style={styles.footerText}>
                      Don't have an account?
                    </ThemedText>
                  </View>

                  <View style={styles.footerBottomRow}>
                    <Pressable
                      accessibilityRole="link"
                      accessibilityLabel="Sign up"
                      onPress={() => router.push("/sign-up")}
                    >
                      <ThemedText type="caption" style={styles.signUpText}>
                        Sign Up
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: "100%",
  },

  // ── Header ──
  headerContainer: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 26,
    fontFamily: Fonts.medium,
    letterSpacing: 0.5,
  },
  headerTextContainer: {
    marginTop: Spacing.xxl,
  },
  headerSubtitle: {
    color: Colors.textBlack,
    fontSize: 12,
    fontFamily: Fonts.regular,
    letterSpacing: 0.2,
  },

  // ── Hero ──
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    height: HERO_SIZE + 45,
    marginTop: Spacing.sm,
  },

  // ── Phone (purple area) ──
  phoneSection: {
    position: "relative",
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xxl,
    zIndex: 20,
  },
  passwordFloating: {
    position: "relative",
    zIndex: 20,
    elevation: 20,
  },
  purpleInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.placeholderText,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBackground,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: Spacing.md
  },
  purpleInput: {
    color: Colors.placeholderText,
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.regular,
  },

  // ── White Panel ──
  whitePanel: {
    flex: 1,
    // position: "relative",
    backgroundColor: Colors.bottomSheet,
    borderTopLeftRadius: 120,
    marginTop: -26,
    paddingHorizontal: Spacing.lg + Spacing.sm,
    paddingTop: 44,
    paddingBottom: Platform.OS === "ios" ? 28 : Spacing.md + Spacing.sm,
    alignItems: "center",
    zIndex: 1,
  },

  // ── Sheet inputs ──
  sheetInputWrapper: {
    width: "100%",
    borderWidth: 0.8,
    borderColor: SHEET_INPUT_BORDER,
    borderRadius: Radius.md,
    backgroundColor: SHEET_INPUT_BG,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  sheetInput: {
    color: Colors.textBlack,
    fontSize: 14,
    flex: 1,
    fontFamily: Fonts.regular,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    // paddingHorizontal: Spacing.md
  },
  passwordInput: {
    // paddingLeft: Spacing.lg
  },
  passwordToggle: {
    paddingHorizontal: Spacing.md,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    paddingRight: Spacing.sm,
    // marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  forgotText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },

  // ── Error ──
  errorText: {
    width: "100%",
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },

  // ── Buttons ──
  signInButton: {
    width: "100%",
    marginTop: Spacing.lg,
  },
  biometricButton: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: "rgba(91, 79, 207, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },

  // ── Footer ──
  footer: {
    width: "100%",
    marginTop: 12,
  },

  footerTopRow: {
    alignItems: "center",
    justifyContent: "center",
  },

  footerBottomRow: {
    marginTop: 6,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: Spacing.xs,
  },

  footerText: {
    color: Colors.textBlack,
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },

  signUpText: {
    color: Colors.signUpLink,
    fontFamily: Fonts.semiBold,
    fontSize: 12.5,
  },
});
