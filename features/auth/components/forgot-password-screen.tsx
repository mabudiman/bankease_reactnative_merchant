import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { Colors, Spacing, Radius, Fonts } from '@/constants/theme';

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const isCodeValid = code.trim().length >= 4;

  function handleChangePassword() {
    if (!isCodeValid) return;
    router.push('/change-password');
  }

  function handleResend() {
    // TODO: re-trigger OTP SMS API
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              <ThemedText style={styles.headerTitle}>Forgot password</ThemedText>
            </View>

            {/* OTP Card */}
            <View style={styles.card}>
              <ThemedText style={styles.label}>Type a code</ThemedText>

              <View style={styles.otpRow}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Code"
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
                  <ThemedText style={styles.resendText}>Resend</ThemedText>
                </Pressable>
              </View>

              <ThemedText style={styles.helperText}>
                We texted you a code to verify your phone number{' '}
                <ThemedText style={styles.phoneHighlight}>(+84) 0398829xxx</ThemedText>
              </ThemedText>

              <ThemedText style={styles.expiryText}>
                This code will expired 10 minutes after this message. If you don't get a message.
              </ThemedText>
            </View>

            {/* Change Password Button */}
            <View style={styles.buttonContainer}>
              <ThemedButton
                title="Change password"
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
    backgroundColor: Colors.white,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.textBlack,
  },

  // Card
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },

  // OTP Row
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  codeInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
    backgroundColor: Colors.white,
  },
  resendButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
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
  buttonContainer: {
    paddingVertical: Spacing.lg,
  },
  submitButton: {
    width: '100%',
    borderRadius: Radius.md,
    minHeight: 52,
  },
});
