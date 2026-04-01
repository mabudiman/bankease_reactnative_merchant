import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/core/i18n';
import { numberToWords } from '@/utils/numberToWords';
import { BankPickerSheet } from './BankPickerSheet';
import { useBankList, useBankBranches } from '../hooks';
import type { TransferType, CardNumberFormData, SameBankFormData, AnotherBankFormData } from '../types';

type AnyFormData = CardNumberFormData | SameBankFormData | AnotherBankFormData;

interface TransferFormProps {
  readonly transferType: TransferType;
  readonly prefillName?: string;
  readonly prefillCardNumber?: string;
  readonly prefillAccountNumber?: string;
  readonly onSubmit: (data: AnyFormData, saveToDirectory: boolean) => void;
  readonly isSubmitting: boolean;
}

export function TransferForm({
  transferType,
  prefillName,
  prefillCardNumber,
  prefillAccountNumber,
  onSubmit,
  isSubmitting,
}: TransferFormProps) {
  const { t } = useTranslation();
  const [saveToDirectory, setSaveToDirectory] = useState(false);
  const [bankSheetOpen, setBankSheetOpen] = useState(false);
  const [branchSheetOpen, setBranchSheetOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedBankName, setSelectedBankName] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState('');

  const { data: banks = [] } = useBankList();
  const { data: branches = [] } = useBankBranches(selectedBankId);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<AnyFormData>({ mode: 'onChange' });

  const amountValue = (watch('amount' as never) as unknown) as string | undefined;
  const amountNumber = amountValue ? parseFloat(amountValue.replace(/[^0-9.]/g, '')) : NaN;
  const amountWords = !isNaN(amountNumber) && amountNumber > 0 ? numberToWords(Math.floor(amountNumber)) + ' dollar' : '';

  // Reset form + bank state when transfer type changes
  useEffect(() => {
    reset({});
    setSelectedBankId(null);
    setSelectedBankName('');
    setSelectedBranchId(null);
    setSelectedBranchName('');
    setSaveToDirectory(false);
  }, [transferType, reset]);

  // Prefill name when beneficiary changes
  useEffect(() => {
    if (prefillName !== undefined) {
      setValue('name' as never, prefillName as never);
    }
  }, [prefillName, setValue]);

  useEffect(() => {
    if (prefillCardNumber !== undefined && transferType !== 'SAME_BANK') {
      setValue('cardNumber' as never, prefillCardNumber as never);
    }
  }, [prefillCardNumber, transferType, setValue]);

  useEffect(() => {
    if (prefillAccountNumber !== undefined && transferType === 'SAME_BANK') {
      setValue('accountNumber' as never, prefillAccountNumber as never);
    }
  }, [prefillAccountNumber, transferType, setValue]);

  function handleFormSubmit(data: AnyFormData) {
    if (transferType === 'ANOTHER_BANK') {
      const enriched: AnotherBankFormData = {
        ...(data as AnotherBankFormData),
        bankId: selectedBankId ?? '',
        bankName: selectedBankName,
        branchId: selectedBranchId ?? '',
        branchName: selectedBranchName,
      };
      onSubmit(enriched, saveToDirectory);
    } else {
      onSubmit(data, saveToDirectory);
    }
  }

  const isAnotherBank = transferType === 'ANOTHER_BANK';
  const isSameBank = transferType === 'SAME_BANK';
  const anotherBankValid = !isAnotherBank || (!!selectedBankId && !!selectedBranchId);
  const canSubmit = isValid && anotherBankValid && !isSubmitting;

  return (
    <View>
      <View style={styles.formContainer}>
        {/* Bank/Branch pickers for "another bank" */}
        {isAnotherBank && (
          <>
            <Pressable
              style={styles.pickerRow}
              onPress={() => setBankSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={t('transfer.field.chooseBank')}
            >
              <ThemedText style={[styles.pickerText, !selectedBankName && styles.placeholder]}>
                {selectedBankName || t('transfer.field.chooseBank')}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
            </Pressable>

            <Pressable
              style={[styles.pickerRow, !selectedBankId && styles.pickerDisabled]}
              onPress={() => selectedBankId && setBranchSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={t('transfer.field.chooseBranch')}
            >
              <ThemedText style={[styles.pickerText, !selectedBranchName && styles.placeholder]}>
                {selectedBranchName || t('transfer.field.chooseBranch')}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
            </Pressable>
          </>
        )}

        {/* Name */}
        <Controller
          control={control}
          name={'name' as never}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              placeholder={t('transfer.field.name')}
              placeholderTextColor="#AAAAAA"
              value={value as string ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        {/* Card number / Account number */}
        {isSameBank ? (
          <Controller
            control={control}
            name={'accountNumber' as never}
            rules={{ required: true, minLength: 8 }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder={t('transfer.field.accountNumber')}
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={value as string ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        ) : (
          <Controller
            control={control}
            name={'cardNumber' as never}
            rules={{ required: true, minLength: 10 }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder={t('transfer.field.cardNumber')}
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={value as string ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        )}

        {/* Amount */}
        <Controller
          control={control}
          name={'amount' as never}
          rules={{
            required: true,
            validate: (v) => {
              const n = parseFloat(String(v));
              return !isNaN(n) && n > 0;
            },
          }}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              placeholder={t('transfer.field.amount')}
              placeholderTextColor="#AAAAAA"
              keyboardType="decimal-pad"
              value={value as string ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {amountWords ? (
          <ThemedText style={styles.amountWords}>{amountWords}</ThemedText>
        ) : null}

        {/* Content / Note */}
        <Controller
          control={control}
          name={(isAnotherBank ? 'note' : 'content') as never}
          rules={{ required: false }}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.input}
              placeholder={t(isAnotherBank ? 'transfer.field.note' : 'transfer.field.content')}
              placeholderTextColor="#AAAAAA"
              value={value as string ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        {/* Save to directory */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setSaveToDirectory((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: saveToDirectory }}
        >
          <View style={[styles.checkbox, saveToDirectory && styles.checkboxChecked]}>
            {saveToDirectory && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
          </View>
          <ThemedText style={styles.checkboxLabel}>{t('transfer.saveToDirectory')}</ThemedText>
        </Pressable>

        {/* Confirm */}
        <Pressable
          style={[styles.confirmButton, !canSubmit && styles.confirmButtonDisabled]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel={t('transfer.confirm')}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.confirmText}>{t('transfer.confirm')}</ThemedText>
          )}
        </Pressable>
      </View>

      {/* Bank picker sheet */}
      <BankPickerSheet
        visible={bankSheetOpen}
        title={t('transfer.bankPicker.title')}
        items={banks}
        selectedId={selectedBankId}
        onSelect={(item) => {
          setSelectedBankId(item.id);
          setSelectedBankName(item.name);
          setSelectedBranchId(null);
          setSelectedBranchName('');
        }}
        onClose={() => setBankSheetOpen(false)}
      />

      {/* Branch picker sheet */}
      <BankPickerSheet
        visible={branchSheetOpen}
        title={t('transfer.field.chooseBranch')}
        items={branches}
        selectedId={selectedBranchId}
        onSelect={(item) => {
          setSelectedBranchId(item.id);
          setSelectedBranchName(item.name);
        }}
        onClose={() => setBranchSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingBottom: 40,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1A1A2E',
    backgroundColor: '#FFFFFF',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  pickerDisabled: {
    opacity: 0.45,
  },
  pickerText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1A1A2E',
  },
  placeholder: {
    color: '#AAAAAA',
  },
  amountWords: {
    marginTop: -4,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
  },
  confirmButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D0D0E8',
  },
  confirmText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
});
