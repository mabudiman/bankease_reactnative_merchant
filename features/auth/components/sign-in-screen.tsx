import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { Colors, Spacing, Radius } from '@/constants/theme';

function handleBiometric() {
  // Placeholder untuk login biometrik
}

export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  function handleSignIn() {
    if (!isFormValid) return;
    setIsLoading(true);
    // Simulasi login — ganti dengan API call yang sebenarnya
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <View style={styles.root}>
      {/* Background ungu mengisi seluruh layar */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Header ── */}
            <View style={styles.headerContainer}>
              <View style={styles.headerRow}>
                <Pressable
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Ionicons name="chevron-back" size={20} color={Colors.white} />
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

            {/* ── Hero / Illustration ── */}
            <View style={styles.heroSection}>
              {/* Lingkaran Lavender besar */}
                <Image
                  source={require('@/assets/images/illustration.png')}
                  style={styles.heroImage}
                  resizeMode="contain"
                  accessibilityLabel="Security illustration"
                />

            </View>

            {/* ── Form Input ── */}
            <View style={styles.formSection}>
              {/* Email */}
              <View style={styles.inputWrapper}>
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
                <View style={styles.inputWrapper}>
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
                <TouchableOpacity style={styles.forgotPassword}>
                  <ThemedText type="caption" style={styles.forgotText}>
                    Forgot your password?
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Spacer agar bottom sheet tidak terlalu mepet */}
            <View style={styles.spacer} />
          </ScrollView>

          {/* ── Bottom Sheet dengan Wave ── */}
          <View style={styles.bottomSheetContainer}>
            {/* <WaveShape color={Colors.bottomSheet} height={120} /> */}
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
                lightColor={isFormValid ? '#3629B7' : '#D1D5DB'}
                darkColor={isFormValid ? '#3629B7' : '#4B5563'}
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
                  source={require('@/assets/images/fingerprint.png')}
                  style={styles.fingerprintImage}
                  resizeMode="contain"
                  accessibilityLabel="Fingerprint icon"
                />
              </TouchableOpacity>

              {/* Footer: Don't have account? */}
              <View style={styles.footer}>
                <ThemedText
                  type="caption"
                  style={styles.footerText}
                >
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
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const HERO_CIRCLE_SIZE = 155;
const FINGERPRINT_SIZE = 14.27;
const DECOR_SIZE_LG = 12;
const DECOR_SIZE_SM = 8;

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
    paddingHorizontal: Spacing.lg,
    paddingBottom: 260,
  },

  // ── Header ──
  headerContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl + Spacing.sm,
    gap: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  headerTextContainer: {
    gap: Spacing.xs,
    marginTop : Spacing.md,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Hero ──
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl * 1.5,
    marginTop: Spacing.sm,
    height: HERO_CIRCLE_SIZE + 45,
  },
  heroImage: {
    width: HERO_CIRCLE_SIZE * 1.5,
    height: HERO_CIRCLE_SIZE * 1.5,
    opacity: 0.85,
  },

  fingerprintImage: {
    width: FINGERPRINT_SIZE * 6,
    height: FINGERPRINT_SIZE * 6,
    opacity: 0.85,
  },

  // ── Form ──
  formSection: {
    gap: Spacing.md + Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  passwordContainer: {
    gap: Spacing.xs + 2,
  },
  inputWrapper: {
    borderWidth: 0.8,
    borderColor: Colors.inputBorder,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBackground,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  input: {
    color: Colors.inputText,
    fontSize: 14,
    flex: 1,
    fontWeight: '400',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingRight: Spacing.sm,
    zIndex: 30,
  },
  forgotText: {
    color: Colors.placeholderText,
    fontSize: 10.5,
    fontWeight: '400',
    zIndex: 1,
  },

  spacer: {
    minHeight: 28,
  },
// ── Bottom Sheet ──
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    backgroundColor: Colors.bottomSheet,
    minHeight: 300,
    borderTopLeftRadius: 88,
    borderTopRightRadius: 0,
    paddingHorizontal: Spacing.lg + Spacing.sm,
    paddingTop: Spacing.md + 2,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.lg + Spacing.sm,
    alignItems: 'center',
    gap: Spacing.md + Spacing.xs,
    overflow: 'hidden',
    transform: [{ translateY: -60 }],
  },
  handleBar: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D9D9D9',
    marginBottom: Spacing.sm + 2,
  },
  signInButton: {
    width: '100%',
    marginTop: Spacing.xs,
  },
  biometricButton: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(91, 79, 207, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs + 2,
  },
  // ── Footer ──
  footer: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: 6,
    position: 'relative',
  },
  footerText: {
    color: Colors.textBlack,
    fontSize: 12.5,
    fontWeight: '400',
    textAlign: 'center',
  },
  signUpButton: {
    position: 'absolute',
    right: 0,
    bottom: 6,
  },

  signUpText: {
    textAlign: 'right',
    color: Colors.signUpLink,
  },
});
