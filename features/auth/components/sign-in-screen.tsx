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
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius, Fonts } from "@/constants/theme";
import { useRouter } from "expo-router";

function handleBiometric() {
  // Placeholder untuk login biometrik
}

export function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  // Scale sizes based on screen height (baseline: 800px)
  const scale = Math.min(screenHeight / 800, 1);
  const heroSize = Math.round(155 * scale);
  const inputHeight = Math.max(Math.round(52 * scale), 40);

  function handleSignIn() {
    if (!isFormValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 2000);
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
            bounces={false}
          >
            {/* ── Top Section (purple background) ── */}
            <View style={styles.topSection}>
              {/* Header */}
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
                  <ThemedText type="title" style={styles.headerTitle}>
                    Sign in
                  </ThemedText>
                </View>
                <View style={styles.headerTextContainer}>
                  <ThemedText type="caption" style={styles.headerSubtitle}>
                    Hello there, sign in to continue
                  </ThemedText>
                </View>
              </View>

              {/* Hero / Illustration */}
              <View style={styles.heroSection}>
                <Image
                  source={require("@/assets/images/illustration.png")}
                  style={{ width: heroSize, height: heroSize, opacity: 0.85 }}
                  resizeMode="contain"
                  accessibilityLabel="Security illustration"
                />
              </View>

              {/* Form Input */}
              <View style={styles.formSection}>
                {/* Email */}
                <View style={[styles.inputWrapper, { height: inputHeight }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Text Input"
                    placeholderTextColor={Colors.placeholderText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                    accessibilityLabel="Email input"
                    returnKeyType="next"
                  />
                </View>

                {/* Password Container */}
                <View style={styles.passwordContainer}>
                  <View style={[styles.inputWrapper, { height: inputHeight }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor={Colors.placeholderText}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      accessibilityLabel="Password input"
                      returnKeyType="done"
                      onSubmitEditing={handleSignIn}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push("/forgot-password")}
                  >
                    <ThemedText type="caption" style={styles.forgotText}>
                      Forgot your password?
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ── Bottom Sheet (part of flow, not absolute) ── */}
            <View style={styles.bottomSheet}>
              {/* Handle bar */}
              <View style={styles.handleBar} />

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
                <Image
                  source={require("@/assets/images/fingerprint.png")}
                  style={styles.fingerprintImage}
                  resizeMode="contain"
                  accessibilityLabel="Fingerprint icon"
                />
              </TouchableOpacity>

              {/* Footer: Don't have account? */}
              <View style={styles.footer}>
                <ThemedText type="caption" style={styles.footerText}>
                  Don't have an account?
                </ThemedText>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="Sign up"
                  style={styles.signUpButton}
                >
                  <ThemedText type="caption" style={styles.signUpText}>
                    Sign Up
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const FINGERPRINT_SIZE = 14.27;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Top Section (purple) ──
  topSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // ── Header ──
  headerContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
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
  headerTextContainer: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontFamily: Fonts.regular,
    letterSpacing: 0.2,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 26,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },

  // ── Hero ──
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
  },

  fingerprintImage: {
    width: FINGERPRINT_SIZE * 6,
    height: FINGERPRINT_SIZE * 6,
    opacity: 0.85,
  },

  // ── Form ──
  formSection: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.lg,
  },
  passwordContainer: {
    gap: Spacing.xs + 2,
  },
  inputWrapper: {
    borderWidth: 0.8,
    borderColor: Colors.inputBorder,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBackground,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  input: {
    color: Colors.inputText,
    fontSize: 14,
    flex: 1,
    fontFamily: Fonts.regular,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    paddingRight: Spacing.sm,
  },
  forgotText: {
    color: Colors.placeholderText,
    fontSize: 10.5,
    fontFamily: Fonts.regular,
  },

  // ── Bottom Sheet (in flow) ──
  bottomSheet: {
    backgroundColor: Colors.bottomSheet,
    borderTopLeftRadius: 88,
    borderTopRightRadius: 0,
    paddingHorizontal: Spacing.lg + Spacing.sm,
    paddingTop: Spacing.md + 2,
    paddingBottom: Platform.OS === "ios" ? 40 : Spacing.xl,
    alignItems: "center",
    gap: Spacing.md + Spacing.xs,
  },
  handleBar: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D9D9D9",
    marginBottom: Spacing.sm,
  },
  signInButton: {
    width: "100%",
  },
  biometricButton: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: "rgba(91, 79, 207, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.sm,
  },

  // ── Footer ──
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xs,
    paddingBottom: 6,
    position: "relative",
  },
  footerText: {
    color: Colors.textBlack,
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  signUpButton: {
    position: "absolute",
    right: 0,
    bottom: 6,
  },
  signUpText: {
    textAlign: "right",
    color: Colors.signUpLink,
    fontFamily: Fonts.semiBold,
  },
});
