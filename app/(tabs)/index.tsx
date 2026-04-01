import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { AccountCardCarousel } from '@/features/dashboard/components/AccountCardCarousel';
import { FeatureMenuGrid } from '@/features/dashboard/components/FeatureMenuGrid';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { displayName, profileImage, cards, privileges, notificationCount, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={styles.loadingText}>{t('dashboard.loading')}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader
        name={displayName}
        notificationCount={notificationCount}
        avatarUri={profileImage}
        onAvatarPress={() => router.push('/(tabs)/settings')}
      />
      <View style={styles.contentCard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Card carousel */}
        <AccountCardCarousel cards={cards} />

        {/* Feature menu */}
        <View style={styles.menuSection}>
          {/* <ThemedText style={styles.sectionTitle}>
            {t('dashboard.section.menu')}
          </ThemedText> */}
          <FeatureMenuGrid privileges={privileges} />
        </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  menuSection: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textBlack,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
});
