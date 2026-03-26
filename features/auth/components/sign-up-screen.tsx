import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { Colors, Spacing, Radius, Fonts } from '@/constants/theme';
import { authService } from '@/features/auth/services/auth-service';
import { useTranslation } from '@/core/i18n/useTranslation';
import Illustration from '@/assets/svgs/sign-up-Illustration.svg';

// Constants for form-on-white styling — separate from the purple-area input tokens
const SHEET_INPUT_BORDER = 'rgba(0, 0, 0, 0.12)';
const SHEET_INPUT_BG = '#FFFFFF';
const SHEET_TEXT = Colors.textBlack;
const SHEET_PLACEHOLDER = '#BABABA';
const SHEET_TEXT_MUTED = Colors.textMuted;

const HERO_CIRCLE_SIZE = 150;

export function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('auth');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid =
    name.trim().length >= 1 &&
    phone.trim().length >= 8 &&
    password.length >= 6 &&
    agreed;

  function clearError() {
    if (error) setError(null);
  }

  async function handleSignUp() {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUp(name, phone, password);
      router.back();
    } catch (err) {
      const msg =
        err instanceof Error && err.message === 'PHONE_TAKEN'
          ? t('signUp.errorPhoneTaken')
          : t('signUp.errorGeneric');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      {/* ── Header in purple safe area ── */}
      <SafeAreaView edges={['top']}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={20} color={Colors.white} />
            </Pressable>
            <ThemedText type="title" lightColor={Colors.white} style={styles.headerTitle}>
              {t('signUp.title')}
            </ThemedText>
          </View>
          <ThemedText
            type="caption"
            lightColor="rgba(255,255,255,0.75)"
            style={styles.headerSubtitle}
          >
            {t('signUp.subtitle')}
          </ThemedText>
        </View>
      </SafeAreaView>

      {/* ── Scrollable body: hero (purple) + white sheet ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero section — stays in purple, never cut by white sheet */}
          <View style={styles.heroSection}>
            {/* Decorative dots positioned around circle */}
            <View style={[styles.dot, styles.dotGreen]} />
            <View style={[styles.dot, styles.dotYellow]} />
            <View style={[styles.dot, styles.dotRed]} />
            <View style={[styles.dot, styles.dotBlue]} />

            <View style={styles.heroCircle}>
              <Illustration
                width={HERO_CIRCLE_SIZE * 0.78}
      height={HERO_CIRCLE_SIZE * 0.78}
                accessibilityLabel="Onboarding illustration"
              />
            </View>
          </View>

          {/* ──────────────────────────────────────────────
              White sheet — normal layout child, NOT absolute.
              flex:1 ensures it fills whatever vertical space
              remains after the hero section, so it always
              anchors to the bottom without any height guessing.
          ────────────────────────────────────────────── */}
          <View
            style={[
              styles.whiteSheet,
              { paddingBottom: Math.max(insets.bottom, Spacing.lg) },
            ]}
          >
            {/* Form fields */}
            <View style={styles.formSection}>
              {/* Name */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('signUp.namePlaceholder')}
                  placeholderTextColor={SHEET_PLACEHOLDER}
                  value={name}
                  onChangeText={(v) => { setName(v); clearError(); }}
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityLabel="Name input"
                />
              </View>

              {/* Phone */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.plainInput]}
                  placeholder={t('signUp.phonePlaceholder')}
                  placeholderTextColor={SHEET_PLACEHOLDER}
                  value={phone}
                  onChangeText={(v) => { setPhone(v); clearError(); }}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  accessibilityLabel="Phone number input"
                />
              </View>

              {/* Password with show/hide toggle (chevron-down per visual spec) */}
              <View style={[styles.inputWrapper, styles.rowWrapper]}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t('signUp.passwordPlaceholder')}
                  placeholderTextColor={SHEET_PLACEHOLDER}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(v) => { setPassword(v); clearError(); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                  accessibilityLabel="Password input"
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.passwordToggle}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'chevron-down'}
                    size={18}
                    color={SHEET_TEXT_MUTED}
                  />
                </Pressable>
              </View>
            </View>

            {/* Agreement checkbox */}
            <Pressable
              style={styles.agreementRow}
              onPress={() => setAgreed((prev) => !prev)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <Ionicons name="checkmark" size={12} color={Colors.white} />}
              </View>
              <View style={styles.agreementTextWrap}>
                <ThemedText type="caption" lightColor={SHEET_TEXT} style={styles.agreementText}>
                  {t('signUp.byCreating')}{' '}
                  <ThemedText type="caption" style={styles.agreementLink}>
                    {t('signUp.terms')}
                  </ThemedText>
                </ThemedText>
              </View>
            </Pressable>

            {/* Error message */}
            {error !== null && (
              <ThemedText type="caption" lightColor="#FF3B30" style={styles.errorText}>
                {error}
              </ThemedText>
            )}

            {/* Spacer pushes CTA toward the bottom */}
            <View style={styles.spacer} />

            {/* Primary CTA */}
            <ThemedButton
              title={t('signUp.cta')}
              variant="primary"
              loading={isLoading}
              disabled={!isFormValid}
              onPress={handleSignUp}
              style={styles.ctaButton}
              lightColor={isFormValid ? Colors.primary : Colors.buttonDisabled}
              darkColor={isFormValid ? Colors.primary : Colors.buttonDisabled}
              lightTextColor={Colors.white}
              darkTextColor={Colors.white}
              accessibilityLabel="Sign up"
            />

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText type="caption" lightColor={SHEET_TEXT_MUTED} style={styles.footerText}>
                {t('signUp.hasAccount')}
              </ThemedText>
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="link"
                accessibilityLabel="Go to sign in"
              >
                <ThemedText type="caption" style={styles.footerLink}>
                  {' '}{t('signUp.signInLink')}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  flex: {
    flex: 1,
  },
  // contentContainerStyle: flexGrow:1 means the content fills at least the
  // full ScrollView height — critical for flex:1 on whiteSheet to work.
  scrollContent: {
    flexGrow: 1,
  },

  // ── Header ──
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    letterSpacing: 0.2,
    marginLeft: 32 + Spacing.sm, // indent past back button width
  },

  // ── Hero (in purple area) ──
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HERO_CIRCLE_SIZE + 80,
    position: 'relative',
  },
  heroCircle: {
    width: HERO_CIRCLE_SIZE,
    height: HERO_CIRCLE_SIZE,
    borderRadius: HERO_CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Decorative dots
  dot: {
    position: 'absolute',
    borderRadius: Radius.full,
  },
  dotGreen: {
    width: 10,
    height: 10,
    backgroundColor: Colors.decorGreen,
    top: 20,
    left: '20%',
  },
  dotYellow: {
    width: 14,
    height: 14,
    backgroundColor: Colors.decorYellow,
    bottom: 16,
    left: '15%',
  },
  dotRed: {
    width: 12,
    height: 12,
    backgroundColor: Colors.decorRed,
    top: 14,
    right: '20%',
  },
  dotBlue: {
    width: 8,
    height: 8,
    backgroundColor: Colors.decorBlue,
    bottom: 20,
    right: '18%',
  },

  // ── White sheet ──
  // flex:1 + flexGrow:1 on scrollContent = white sheet always fills the
  // remainder of the screen below the hero. No absolute positioning needed.
  whiteSheet: {
    flex: 1,
    backgroundColor: SHEET_INPUT_BG,
    borderTopLeftRadius: 88,
    borderTopRightRadius: 12,
    paddingHorizontal: Spacing.lg + Spacing.sm,
    paddingTop: Spacing.xxl + Spacing.sm,
  },

  // ── Form fields ──
  formSection: {
    gap: Spacing.md,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: SHEET_INPUT_BORDER,
    borderRadius: Radius.md,
    backgroundColor: SHEET_INPUT_BG,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  input: {
    color: SHEET_TEXT,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  plainInput: {
    paddingHorizontal: Spacing.lg,
  },
  // Row wrapper for phone and password fields
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },

  // Phone prefix
  phonePrefix: {
    paddingHorizontal: Spacing.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonePrefixText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  phoneDivider: {
    width: 1,
    height: 28,
    backgroundColor: SHEET_INPUT_BORDER,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },

  // Password toggle
  passwordInput: {
    flex: 1,
    paddingLeft: Spacing.lg,
  },
  passwordToggle: {
    paddingHorizontal: Spacing.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Agreement ──
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 2,
    marginTop: Spacing.md,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  agreementTextWrap: {
    flex: 1,
  },
  agreementText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  agreementLink: {
    color: Colors.signUpLink,
    fontFamily: Fonts.semiBold,
    fontSize: 12,
  },

  // ── Error ──
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Pushes CTA toward bottom while still allowing scroll if needed
  spacer: {
    flex: 1,
    minHeight: Spacing.xl,
  },

  // ── CTA ──
  ctaButton: {
    width: '100%',
    borderRadius: Radius.pill,
    marginBottom: Spacing.md,
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  footerText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  footerLink: {
    color: Colors.signUpLink,
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
});
