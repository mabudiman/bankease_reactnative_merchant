import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { Colors, Spacing, Radius, Fonts } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';

export function ChangePasswordSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');

  function handleOk() {
    router.replace('/');
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
        {/* Header - back arrow only */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/change-password-success.png')}
            style={styles.illustration}
            resizeMode="contain"
            accessibilityLabel="Password changed successfully illustration"
          />

          <ThemedText style={styles.successTitle}>
            {t('changePasswordSuccess')}
          </ThemedText>

          <ThemedText style={styles.successDescription}>
            {t('changePasswordSuccessDesc')}
          </ThemedText>
        </View>

        {/* Ok Button */}
        <View style={styles.buttonContainer}>
          <ThemedButton
            title={t('ok')}
            variant="primary"
            onPress={handleOk}
            style={styles.okButton}
            lightColor={Colors.primary}
            darkColor={Colors.primary}
            lightTextColor={Colors.white}
            darkTextColor={Colors.white}
            accessibilityLabel="Ok, go back to sign in"
          />
        </View>
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

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustration: {
    width: 220,
    height: 180,
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  successDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Button
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  okButton: {
    width: '100%',
    borderRadius: Radius.md,
    minHeight: 52,
  },
});
