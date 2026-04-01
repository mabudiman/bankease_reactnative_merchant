import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';
import NotificationIcon from '@/assets/svgs/icon_notification.svg';

interface DashboardHeaderProps {
  readonly name: string;
  readonly notificationCount: number;
  readonly avatarUri?: string;
  readonly onAvatarPress?: () => void;
}

export function DashboardHeader({ name, notificationCount, avatarUri, onAvatarPress }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const greeting = t('dashboard.header.greeting').replace('{{name}}', name);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.row}>
          {/* Left: avatar + greeting */}
          <View style={styles.leftRow}>
            <Pressable
              onPress={onAvatarPress}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
              disabled={!onAvatarPress}
            >
              <View style={styles.avatar}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={22} color={Colors.primary} />
                )}
              </View>
            </Pressable>
            <ThemedText style={styles.greeting}>{greeting}</ThemedText>
          </View>

          {/* Right: notification bell */}
          <Pressable
            style={styles.bellWrapper}
            accessibilityRole="button"
            accessibilityLabel={t('dashboard.header.notificationA11y')}
          >
            <NotificationIcon width={26} height={26} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : String(notificationCount)}
                </ThemedText>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  bellIcon: {
    width: 26,
    height: 26,
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
  greeting: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bellWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});
