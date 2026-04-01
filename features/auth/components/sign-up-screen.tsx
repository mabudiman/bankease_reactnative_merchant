import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
  Alert
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius, Fonts } from "@/constants/theme";
import { authService } from "@/features/auth/services/auth-service";
import { useTranslation } from "@/core/i18n/useTranslation";
import Illustration from "@/assets/svgs/sign-up-Illustration.svg";

const HERO_SIZE = 155;
const SHEET_PLACEHOLDER = "#AAAAAA";

const COUNTRY_CODES = [
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+86", flag: "🇨🇳", name: "China" }
];

export function SignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation("auth");

  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field-level validation hints (shown as user types)
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const isFormValid =
    name.trim().length >= 1 &&
    nameError === null &&
    phone.trim().length >= 8 &&
    phoneError === null &&
    password.length >= 6 &&
    passwordError === null &&
    agreed;

  /** Username: no whitespace allowed */
  function handleNameChange(v: string) {
    setName(v);
    setError(null);
    if (/\s/.test(v)) {
      setNameError('Username must not contain spaces');
    } else {
      setNameError(null);
    }
  }

  /** Phone: only digits and an optional leading + */
  function handlePhoneChange(v: string) {
    // Allow digits, and a + only at position 0
    const cleaned = v.replaceAll(/(?!^\+)[^\d]/g, '');
    setPhone(cleaned);
    setError(null);
    if (v === cleaned) {
      setPhoneError(null);
    } else {
      setPhoneError('Phone number may only contain digits (and a leading +)');
    }
  }

  /** Password: minimum 6 characters */
  function handlePasswordChange(v: string) {
    setPassword(v);
    setError(null);
    if (v.length > 0 && v.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError(null);
    }
  }

  async function handleSignUp() {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUp(name, phone.trim(), password.trim());
      Alert.alert(
        'Sign Up Successful',
        'Your account has been registered. Please sign in.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PHONE_TAKEN") {
          setError(t("signUp.errorPhoneTaken"));
        } else if (err.message === "NETWORK_ERROR") {
          setError(t("signUp.errorGeneric"));
        } else {
          setError(t("signUp.errorGeneric"));
        }
      } else {
        setError(t("signUp.errorGeneric"));
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
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
            >
              {/* ── Header (purple) ── */}
              <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                  <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityRole='button'
                    accessibilityLabel='Go back'
                  >
                    <Ionicons
                      name='chevron-back'
                      size={20}
                      color={Colors.white}
                    />
                  </Pressable>
                  <ThemedText type='title' style={styles.headerTitle}>
                    {t("signUp.title")}
                  </ThemedText>
                </View>
                <View style={styles.headerTextContainer}>
                  <ThemedText type='caption' style={styles.headerSubtitle}>
                    {t("signUp.subtitle")}
                  </ThemedText>
                </View>
              </View>

              {/* ── Hero (purple) with decorative dots ── */}
              <View style={styles.heroSection}>
                <View style={[styles.dot, styles.dotGreen]} />
                <View style={[styles.dot, styles.dotYellow]} />
                <View style={[styles.dot, styles.dotRed]} />
                <View style={[styles.dot, styles.dotBlue]} />
                <Illustration
                  width={HERO_SIZE * 1.5}
                  height={HERO_SIZE * 1.5}
                  accessibilityLabel='Onboarding illustration'
                />
              </View>

              {/* ── Purple inputs: Name + Phone ── */}
              <View style={styles.inputSection}>
                {/* Name */}
                <View style={styles.purpleInputWrapper}>
                  <TextInput
                    style={styles.purpleInput}
                    placeholder={t("signUp.namePlaceholder")}
                    placeholderTextColor={Colors.placeholderText}
                    value={name}
                    onChangeText={handleNameChange}
                    autoCapitalize='none'
                    autoCorrect={false}
                    returnKeyType='next'
                    accessibilityLabel='Name input'
                  />
                </View>
                {!!nameError && (
                  <ThemedText type='caption' style={styles.fieldError}>{nameError}</ThemedText>
                )}

                {/* Phone with country code dropdown */}
                <View style={[styles.purpleInputWrapper, styles.phoneRow]}>
                  {/* <Pressable
                    style={styles.countryCodePicker}
                    onPress={() => setShowCountryPicker(true)}
                    accessibilityRole='button'
                    accessibilityLabel='Select country code'
                  >
                    <ThemedText style={styles.countryCodeText}>
                      {selectedCountry.flag} {selectedCountry.code}
                    </ThemedText>
                    <Ionicons name='chevron-down' size={14} color={Colors.placeholderText} />
                  </Pressable> */}
                  <View style={styles.phoneVerticalDivider} />
                  <TextInput
                    style={[styles.purpleInput, styles.phoneInput]}
                    placeholder={t("signUp.phonePlaceholder")}
                    placeholderTextColor={Colors.placeholderText}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType='phone-pad'
                    returnKeyType='next'
                    accessibilityLabel='Phone number input'
                  />
                </View>
                {!!phoneError && (
                  <ThemedText type='caption' style={styles.fieldError}>{phoneError}</ThemedText>
                )}
              </View>

              {/* ── White Panel (mirrors sign-in pattern) ── */}
              <View style={styles.whitePanel}>
                {/* Password */}
                <View style={[styles.purpleInputWrapper, styles.passwordRow]}>
                  <TextInput
                    style={[styles.purpleInput, styles.passwordInput]}
                    placeholder={t("signUp.passwordPlaceholder")}
                    placeholderTextColor={SHEET_PLACEHOLDER}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    autoCapitalize='none'
                    autoCorrect={false}
                    returnKeyType='done'
                    onSubmitEditing={handleSignUp}
                    accessibilityLabel='Password input'
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.passwordToggle}
                    accessibilityRole='button'
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "chevron-down"}
                      size={18}
                      color={SHEET_PLACEHOLDER}
                    />
                  </Pressable>
                </View>

                {!!passwordError && (
                  <ThemedText type='caption' style={styles.fieldError}>{passwordError}</ThemedText>
                )}

                {/* Agreement checkbox */}
                <Pressable
                  style={styles.agreementRow}
                  onPress={() => setAgreed((prev) => !prev)}
                  accessibilityRole='checkbox'
                  accessibilityState={{ checked: agreed }}
                >
                  <View
                    style={[styles.checkbox, agreed && styles.checkboxActive]}
                  >
                    {agreed && (
                      // <Ionicons name='checkmark' size={14} color={Colors.primary} />
                      <View style={styles.checkmark} />
                    )}
                  </View>
                  <View style={styles.agreementTextWrap}>
                    <ThemedText type='caption' style={styles.agreementText}>
                      {t("signUp.byCreating")}{" "}
                      <ThemedText type='caption' style={styles.agreementLink}>
                        {t("signUp.terms")}
                      </ThemedText>
                    </ThemedText>
                  </View>
                </Pressable>

                {/* Error message */}
                {error !== null && (
                  <ThemedText
                    type='caption'
                    lightColor='#FF3B30'
                    style={styles.errorText}
                  >
                    {error}
                  </ThemedText>
                )}

                {/* Sign Up Button */}
                <ThemedButton
                  title={t("signUp.cta")}
                  variant='primary'
                  loading={isLoading}
                  disabled={!isFormValid}
                  onPress={handleSignUp}
                  style={[styles.signUpButton, { borderRadius: Radius.md }]}
                  accessibilityLabel='Sign up'
                  lightColor={isFormValid ? Colors.primary : "#D1D5DB"}
                  darkColor={isFormValid ? Colors.primary : "#4B5563"}
                  lightTextColor='#FFFFFF'
                  darkTextColor='#FFFFFF'
                />

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.footerTopRow}>
                    <ThemedText type='caption' style={styles.footerText}>
                      {t("signUp.hasAccount")}
                    </ThemedText>
                  </View>
                  <View style={styles.footerBottomRow}>
                    <Pressable
                      onPress={() => router.back()}
                      accessibilityRole='link'
                      accessibilityLabel='Go to sign in'
                    >
                      <ThemedText type='caption' style={styles.footerLink}>
                        {t("signUp.signInLink")}
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── Country Code Picker Modal ── */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType='fade'
        onRequestClose={() => setShowCountryPicker(false)}
        accessibilityViewIsModal
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>
              Select Country Code
            </ThemedText>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.countryItem,
                    item.code === selectedCountry.code &&
                      styles.countryItemActive
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryPicker(false);
                  }}
                  accessibilityRole='button'
                  accessibilityLabel={`${item.name} ${item.code}`}
                >
                  <ThemedText style={styles.countryFlag}>
                    {item.flag}
                  </ThemedText>
                  <ThemedText style={styles.countryName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.countryCode}>
                    {item.code}
                  </ThemedText>
                  {item.code === selectedCountry.code && (
                    <Ionicons
                      name='checkmark'
                      size={16}
                      color={Colors.primary}
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  safeArea: {
    flex: 1
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: "100%"
  },

  // ── Header ──
  headerContainer: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    marginRight: Spacing.sm
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 26,
    fontFamily: Fonts.medium,
    letterSpacing: 0.5
  },
  headerTextContainer: {
    marginTop: Spacing.xxl
  },
  headerSubtitle: {
    color: Colors.textBlack,
    fontSize: 12,
    fontFamily: Fonts.regular,
    letterSpacing: 0.2
  },

  // ── Hero ──
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    height: HERO_SIZE + 45,
    marginTop: Spacing.sm
  },

  // Decorative dots
  dot: {
    position: "absolute",
    borderRadius: Radius.full
  },
  dotGreen: {
    width: 10,
    height: 10,
    backgroundColor: Colors.decorGreen,
    top: 20,
    left: "20%"
  },
  dotYellow: {
    width: 14,
    height: 14,
    backgroundColor: Colors.decorYellow,
    bottom: 16,
    left: "15%"
  },
  dotRed: {
    width: 12,
    height: 12,
    backgroundColor: Colors.decorRed,
    top: 14,
    right: "20%"
  },
  dotBlue: {
    width: 8,
    height: 8,
    backgroundColor: Colors.decorBlue,
    bottom: 20,
    right: "18%"
  },

  // ── Purple inputs ──
  inputSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    zIndex: 20,
    gap: Spacing.md
  },
  purpleInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.placeholderText,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBackground,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 0
  },
  purpleInput: {
    color: Colors.placeholderText,
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.regular,
    paddingHorizontal: Spacing.md
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0
  },
  countryCodePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.md,
    alignSelf: "stretch",
    justifyContent: "center"
  },
  countryCodeText: {
    color: Colors.placeholderText,
    fontSize: 13,
    fontFamily: Fonts.regular
  },
  phoneVerticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.placeholderText,
    opacity: 0.4
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Spacing.md
  },

  // ── White Panel (mirrors sign-in) ──
  whitePanel: {
    flex: 1,
    backgroundColor: Colors.bottomSheet,
    borderTopLeftRadius: 120,
    marginTop: -26,
    paddingHorizontal: Spacing.lg,
    paddingTop: 44,
    paddingBottom: Platform.OS === "ios" ? 28 : Spacing.md + Spacing.sm,
    alignItems: "center",
    zIndex: 1
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.md
  },
  passwordToggle: {
    paddingHorizontal: Spacing.md,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center"
  },

  // ── Agreement ──
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm + 2,
    width: "100%",
    marginTop: Spacing.md,
    marginBottom: Spacing.sm
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0
  },
  checkmark: {
    width: 11,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.primary,
    transform: [{ rotate: "-50deg" }],
    marginTop: -2
  },
  checkboxActive: {
    backgroundColor: "transparent",
    borderColor: Colors.primary
  },
  agreementTextWrap: {
    flex: 1
  },
  agreementText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    color: Colors.textBlack
  },
  agreementLink: {
    color: Colors.signUpLink,
    fontFamily: Fonts.semiBold,
    fontSize: 12
  },

  // ── Error ──
  errorText: {
    width: "100%",
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: Spacing.xs
  },
  fieldError: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#FF453A',
    marginTop: 4,
    marginBottom: 2,
  },

  // ── Sign Up Button ──
  signUpButton: {
    width: "100%",
    marginTop: Spacing.lg
  },

  // ── Footer ──
  footer: {
    width: "100%",
    marginTop: 12
  },
  footerTopRow: {
    alignItems: "center",
    justifyContent: "center"
  },
  footerBottomRow: {
    marginTop: 6,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: Spacing.xs
  },
  footerText: {
    color: Colors.textBlack,
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    textAlign: "center"
  },
  footerLink: {
    color: Colors.signUpLink,
    fontFamily: Fonts.semiBold,
    fontSize: 12.5
  },

  // ── Country Picker Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: 400
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textBlack,
    marginBottom: Spacing.md,
    textAlign: "center"
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm
  },
  countryItemActive: {
    backgroundColor: `${Colors.primary}18`
  },
  countryFlag: {
    fontSize: 20
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack
  },
  countryCode: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textMuted,
    marginRight: Spacing.xs
  }
});
