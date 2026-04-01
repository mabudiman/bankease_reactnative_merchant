import React, { useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';

export interface PickerItem {
  id: string;
  name: string;
}

interface BankPickerSheetProps {
  readonly visible: boolean;
  readonly title: string;
  readonly items: PickerItem[];
  readonly selectedId: string | null;
  readonly onSelect: (item: PickerItem) => void;
  readonly onClose: () => void;
}

export function BankPickerSheet({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
}: BankPickerSheetProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    : items;

  function handleSelect(item: PickerItem) {
    onSelect(item);
    setQuery('');
    onClose();
  }

  function handleClose() {
    setQuery('');
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetContainer}
      >
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title */}
          <ThemedText style={styles.title}>{title}</ThemedText>

          {/* Search */}
          <View style={styles.searchRow}>
            <Ionicons name="search" size={16} color="#AAAAAA" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('transfer.bankPicker.search')}
              placeholderTextColor="#AAAAAA"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} accessibilityRole="button">
                <Ionicons name="close-circle" size={16} color="#AAAAAA" />
              </Pressable>
            )}
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <Pressable
                  style={({ pressed }) => [styles.listItem, pressed && styles.listItemPressed]}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.name}
                  accessibilityState={{ selected: isSelected }}
                >
                  <ThemedText
                    style={[styles.itemName, isSelected && styles.itemNameSelected]}
                  >
                    {item.name}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={Colors.primary} />
                  )}
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: 480,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1A1A2E',
    padding: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  listItemPressed: {
    opacity: 0.6,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1A1A2E',
  },
  itemNameSelected: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A2E',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});
