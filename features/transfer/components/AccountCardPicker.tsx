import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';
import { formatCurrency } from '@/utils/money';
import type { TransferCard } from '../types';

interface AccountCardPickerProps {
  readonly cards: TransferCard[];
  readonly selectedCard: TransferCard | null;
  readonly onPress: () => void;
}

export function AccountCardPicker({ cards: _cards, selectedCard, onPress }: AccountCardPickerProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t('transfer.chooseCard')}
      >
        <ThemedText style={[styles.label, !selectedCard && styles.placeholder]}>
          {selectedCard ? selectedCard.maskedNumber : t('transfer.chooseCard')}
        </ThemedText>
        <Ionicons name="chevron-expand" size={20} color="#9A9A9A" />
      </Pressable>
      {selectedCard && (
        <ThemedText style={styles.balance}>
          {t('transfer.availableBalance')}{' '}
          <ThemedText style={styles.balanceAmount}>
            {formatCurrency(selectedCard.balance, selectedCard.currency)}
          </ThemedText>
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#343434',
  },
  placeholder: {
    color: '#AAAAAA',
  },
  balance: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  balanceAmount: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: 12,
  },
});
