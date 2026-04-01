import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';
import {
  AccountCardPicker,
  TransactionTypeSelector,
  BeneficiaryPicker,
  TransferForm,
} from '@/features/transfer/components';
import {
  useTransferCards,
  useBeneficiaries,
  useSubmitTransfer,
} from '@/features/transfer/hooks';
import type {
  TransferType,
  TransferCard,
  Beneficiary,
  CardNumberFormData,
  SameBankFormData,
  AnotherBankFormData,
} from '@/features/transfer/types';

type AnyFormData = CardNumberFormData | SameBankFormData | AnotherBankFormData;

export default function TransferScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: cards = [], isLoading: cardsLoading } = useTransferCards();
  const { data: beneficiaries = [], isLoading: benLoading } = useBeneficiaries();
  const submitMutation = useSubmitTransfer();

  const [cardPickerOpen, setCardPickerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TransferCard | null>(null);
  const [transferType, setTransferType] = useState<TransferType>('CARD_NUMBER');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  const handleSelectBeneficiary = useCallback((ben: Beneficiary) => {
    setSelectedBeneficiary(ben);
  }, []);

  function handleSubmit(data: AnyFormData, saveToDirectory: boolean) {
    if (!selectedCard) {
      Alert.alert(t('transfer.chooseCard'));
      return;
    }

    submitMutation.mutate(
      {
        sourceCardId: selectedCard.id,
        transferType,
        formData: data,
        saveToDirectory,
      },
      {
        onSuccess: () => {
          Alert.alert(t('transfer.success.title'), t('transfer.success.message'), [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert(t('transfer.error.title'), t('transfer.error.message'));
        },
      },
    );
  }

  const isLoading = cardsLoading || benLoading;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{t('transfer.title')}</ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          {/* Account card picker */}
          <AccountCardPicker
            cards={cards}
            selectedCard={selectedCard}
            onPress={() => setCardPickerOpen(true)}
          />

          {/* Transaction type selector */}
          <TransactionTypeSelector
            selected={transferType}
            onChange={(type) => {
              setTransferType(type);
              setSelectedBeneficiary(null);
            }}
          />

          {/* Beneficiary picker */}
          <BeneficiaryPicker
            beneficiaries={beneficiaries}
            selectedId={selectedBeneficiary?.id ?? null}
            onSelect={handleSelectBeneficiary}
            onAddPress={() => {}}
          />

          {/* Form */}
          <TransferForm
            transferType={transferType}
            prefillName={selectedBeneficiary?.name}
            prefillCardNumber={selectedBeneficiary?.cardNumber}
            prefillAccountNumber={selectedBeneficiary?.accountNumber}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* Card picker modal */}
      <Modal
        visible={cardPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setCardPickerOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setCardPickerOpen(false)} />
        <View style={styles.cardSheet}>
          <View style={styles.handle} />
          <ThemedText style={styles.sheetTitle}>{t('transfer.chooseCard')}</ThemedText>
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedCard?.id === item.id;
              return (
                <Pressable
                  style={({ pressed }) => [styles.cardItem, pressed && { opacity: 0.7 }]}
                  onPress={() => {
                    setSelectedCard(item);
                    setCardPickerOpen(false);
                  }}
                  accessibilityRole="button"
                >
                  <View style={styles.cardItemLeft}>
                    <Ionicons name="card-outline" size={20} color={Colors.primary} />
                    <ThemedText style={styles.cardItemLabel}>{item.maskedNumber}</ThemedText>
                  </View>
                  {isSelected && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A2E',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Card picker modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: 360,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginVertical: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  cardItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardItemLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1A1A2E',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});
