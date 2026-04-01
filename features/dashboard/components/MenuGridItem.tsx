import React, { memo } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { useTranslation } from '@/core/i18n';
import type { Privilege } from '../types';

interface MenuGridItemProps {
  readonly privilege: Privilege;
}

function MenuGridItemComponent({ privilege }: MenuGridItemProps) {
  const { t } = useTranslation();
  const router = useRouter();

  function handlePress() {
    if (privilege.title.toLowerCase() === 'transfer') {
      router.push('/transfer' as never);
      return;
    }
    Alert.alert(
      t('dashboard.comingSoon.title'),
      t('dashboard.comingSoon.message'),
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={privilege.title}
    >
      {/* <View style={[styles.iconCircle, { backgroundColor: `${privilege.color}18` }]}> */}
      <View>
        <Ionicons
          name={privilege.icon as React.ComponentProps<typeof Ionicons>['name']}
          size={26}
          color={privilege.color}
        />
      </View>
      <ThemedText style={styles.label} numberOfLines={2}>
        {privilege.title}
      </ThemedText>
    </Pressable>
  );
}

export const MenuGridItem = memo(MenuGridItemComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 90,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    color: '#343434',
    lineHeight: 14,
  },
});
