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
import { useTranslation } from '@/core/i18n';

export function ChangePasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const showMismatchError =
    confirmPassword.length > 0 && !passwordsMatch;
  const isFormValid =
    newPassword.trim().length >= 6 &&
    confirmPassword.trim().length >= 6 &&
    passwordsMatch;

  function handleChangePassword() {
    if (!isFormValid) return;
    setIsLoading(true);
    // TODO: call change password API
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/change-password-success');
    }, 1500);
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
              <ThemedText style={styles.headerTitle}>{t('changePassword')}</ThemedText>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              {/* New Password */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>{t('typeNewPassword')}</ThemedText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    accessibilityLabel="New password input"
                    returnKeyType="next"
                  />
                  <Pressable
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    accessibilityRole="button"
                    accessibilityLabel={showNewPassword ? 'Hide password' : 'Show password'}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={Colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>{t('confirmPassword')}</ThemedText>
                <View style={[
                  styles.inputWrapper,
                  showMismatchError && styles.inputError,
                ]}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    accessibilityLabel="Confirm password input"
                    returnKeyType="done"
                    onSubmitEditing={handleChangePassword}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    accessibilityRole="button"
                    accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={Colors.textMuted}
                    />
                  </Pressable>
                </View>
                {showMismatchError && (
                  <ThemedText style={styles.errorText}>
                    {t('passwordsDoNotMatch')}
                  </ThemedText>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <ThemedButton
                title={t('changePassword')}
                variant="primary"
                disabled={!isFormValid}
                loading={isLoading}
                onPress={handleChangePassword}
                style={styles.submitButton}
                lightColor={isFormValid ? Colors.primary : Colors.buttonDisabled}
                darkColor={isFormValid ? Colors.primary : Colors.buttonDisabled}
                lightTextColor={isFormValid ? Colors.white : Colors.buttonDisabledText}
                darkTextColor={isFormValid ? Colors.white : Colors.buttonDisabledText}
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

  // Input group
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
  },
  inputError: {
    borderColor: Colors.light.activityNegative,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.light.activityNegative,
    marginTop: Spacing.xs,
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
