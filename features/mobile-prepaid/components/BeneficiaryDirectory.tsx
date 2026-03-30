// features/mobile-prepaid/components/BeneficiaryDirectory.tsx
import React, { memo } from 'react';
import { View, ScrollView, Pressable, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { Beneficiary } from '../types';

interface BeneficiaryDirectoryProps {
  beneficiaries: Beneficiary[];
  selectedId: string | null;
  onSelect: (beneficiary: Beneficiary) => void;
}

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

function BeneficiaryDirectoryComponent({
  beneficiaries,
  selectedId,
  onSelect,
}: BeneficiaryDirectoryProps) {
  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <ThemedText style={styles.headerTitle}>Directory</ThemedText>
        <Pressable onPress={() => Alert.alert('Coming Soon')}>
          <ThemedText style={styles.findLink}>Find beneficiary</ThemedText>
        </Pressable>
      </View>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add button */}
        <Pressable
          style={styles.addButton}
          onPress={() => Alert.alert('Coming Soon')}
          accessibilityRole="button"
          accessibilityLabel="Add beneficiary"
        >
          <Ionicons name="add" size={28} color="#9E9E9E" />
        </Pressable>

        {/* Beneficiary items */}
        {beneficiaries.map((b) => {
          const isSelected = selectedId === b.id;
          return (
            <Pressable
              key={b.id}
              style={styles.beneficiaryItem}
              onPress={() => onSelect(b)}
              accessibilityRole="button"
              accessibilityLabel={b.name}
            >
              <View
                style={[
                  styles.avatarWrapper,
                  isSelected && styles.avatarSelected,
                ]}
              >
                {b.avatar ? (
                  <Image
                    source={{ uri: b.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <ThemedText style={styles.avatarInitial}>
                      {getInitials(b.name)}
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.beneficiaryName} numberOfLines={1}>
                {b.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const BeneficiaryDirectory = memo(BeneficiaryDirectoryComponent);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#343434',
  },
  findLink: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: Colors.primary,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 4,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficiaryItem: {
    alignItems: 'center',
    width: 72,
    gap: 6,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: '#687076',
  },
  beneficiaryName: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#343434',
    textAlign: 'center',
  },
});
