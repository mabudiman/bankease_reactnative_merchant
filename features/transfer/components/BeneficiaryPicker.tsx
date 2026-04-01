import React, { memo, useMemo, useCallback } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';
import type { Beneficiary } from '../types';

interface BeneficiaryPickerProps {
  readonly beneficiaries: Beneficiary[];
  readonly selectedId: string | null;
  readonly onSelect: (beneficiary: Beneficiary) => void;
  readonly onAddPress: () => void;
}

// ─── Memoised item — only re-renders when its own isSelected changes ─────────

interface BeneficiaryItemProps {
  readonly ben: Beneficiary;
  readonly isSelected: boolean;
  readonly onSelect: (ben: Beneficiary) => void;
}

const BeneficiaryItem = memo(function BeneficiaryItem({ ben, isSelected, onSelect }: BeneficiaryItemProps) {
  // Stable object reference — Image won't treat it as a new source on re-render
  const source = useMemo(() => ({ uri: ben.avatarUrl }), [ben.avatarUrl]);
  const handlePress = useCallback(() => onSelect(ben), [onSelect, ben]);

  return (
    <Pressable
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={ben.name}
      accessibilityState={{ selected: isSelected }}
    >
      <Image
        source={source}
        style={styles.avatar}
        fadeDuration={0}
      />
      <ThemedText style={[styles.name, isSelected && styles.nameSelected]}>
        {ben.name}
      </ThemedText>
    </Pressable>
  );
});

export function BeneficiaryPicker({
  beneficiaries,
  selectedId,
  onSelect,
  onAddPress,
}: BeneficiaryPickerProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionLabel}>{t('transfer.chooseBeneficiary')}</ThemedText>
        <Pressable onPress={() => {}} accessibilityRole="button">
          <ThemedText style={styles.findLink}>{t('transfer.findBeneficiary')}</ThemedText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* Add new beneficiary button */}
        <Pressable
          style={styles.card}
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel={t('transfer.addBeneficiary')}
        >
          <View style={styles.addCircle}>
            <Ionicons name="add" size={22} color={Colors.white} />
          </View>
        </Pressable>

        {beneficiaries.map((ben) => (
          <BeneficiaryItem
            key={ben.id}
            ben={ben}
            isSelected={selectedId === ben.id}
            onSelect={onSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#989898',
  },
  findLink: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 4,
  },
  card: {
    width: 110,
    height: 120,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    filter: [{ dropShadow: { offsetX: 0, offsetY: 8, standardDeviation: 8, color: 'rgba(0,0,0,0.06)' } }],
  },
  cardSelected: {
    borderColor: Colors.primary,
  },
  addCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F1F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0E0E0',
  },
  name: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    textAlign: 'center',
  },
  nameSelected: {
    color: Colors.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
});
