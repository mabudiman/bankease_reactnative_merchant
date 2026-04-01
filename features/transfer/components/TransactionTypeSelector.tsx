import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { useTranslation } from '@/core/i18n';
import type { TransferType } from '../types';
import { Fonts } from '@/constants/theme';

const cardIcon = require('@/assets/images/icons/icon-card-white.png') as ImageSourcePropType;
const personIcon = require('@/assets/images/icons/icon-person-white.png') as ImageSourcePropType;
const bankIcon = require('@/assets/images/icons/icon-bank-white.png') as ImageSourcePropType;

interface TransactionType {
  key: TransferType;
  labelKey: string;
  icon: ImageSourcePropType;
  activeColor: string;
}

const TYPES: TransactionType[] = [
  {
    key: 'CARD_NUMBER',
    labelKey: 'transfer.type.cardNumber',
    icon: cardIcon,
    activeColor: '#3629B7',
  },
  {
    key: 'SAME_BANK',
    labelKey: 'transfer.type.sameBank',
    icon: personIcon,
    activeColor: '#3629B7',
  },
  {
    key: 'ANOTHER_BANK',
    labelKey: 'transfer.type.anotherBank',
    icon: bankIcon,
    activeColor: '#F4A208',
  },
];

interface TransactionTypeSelectorProps {
  readonly selected: TransferType;
  readonly onChange: (type: TransferType) => void;
}

export function TransactionTypeSelector({ selected, onChange }: TransactionTypeSelectorProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.sectionLabel}>{t('transfer.chooseTransaction')}</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {TYPES.map((type) => {
          const isActive = selected === type.key;
          return (
            <Pressable
              key={type.key}
              style={[
                styles.card,
                isActive && { backgroundColor: type.activeColor },
              ]}
              onPress={() => onChange(type.key)}
              accessibilityRole="button"
              accessibilityLabel={t(type.labelKey)}
              accessibilityState={{ selected: isActive }}
            >
              <Image
                source={type.icon}
                style={[styles.icon, !isActive && styles.iconInactive]}
                resizeMode="contain"
              />
              <ThemedText
                style={[styles.cardLabel, isActive && styles.cardLabelActive]}
                numberOfLines={2}
              >
                {t(type.labelKey)}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#989898',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    width: 130,
    height: 100,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 6,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  iconInactive: {
    tintColor: '#FFFFFF',
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 15,
  },
  cardLabelActive: {
    color: '#FFFFFF',
  },
});
