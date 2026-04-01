import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WithDrawIllustration from '@/assets/svgs/with-draw.svg';
import { PrimaryButton } from '@/components/ui/primary-button';
import {
  AccountSelectionModal,
  ChooseAccountField,
  ChooseAmount,
} from '@/components/form';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import {
  MOCK_ACCOUNTS,
  MOCK_ACCOUNT_BALANCE,
  PRESET_AMOUNTS,
  type MockAccount,
  type WithdrawFlowState,
} from '../types';
import { isValidPhone, maskAccountNumber } from '../utils';

// ─── Module-level sub-components (S6478) ─────────────────────────────────────

interface FormHeaderProps {
  readonly onBack: () => void;
}

function FormHeader({ onBack }: FormHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
      </Pressable>
      <Text style={styles.headerTitle}>Withdraw</Text>
    </View>
  );
}

interface SuccessContentProps {
  readonly onConfirm: () => void;
}

function SuccessContent({ onConfirm }: SuccessContentProps) {
  return (
    <View style={styles.successContainer}>
      <View style={styles.illustrationWrapper}>
        <WithDrawIllustration width={240} height={200} />
      </View>
      <Text style={styles.successTitle}>Successful withdrawal!</Text>
      <Text style={styles.successDescription}>
        You have successfully withdrawn money! Please check the balance in the card management section.
      </Text>
      <PrimaryButton
        title="Confirm"
        onPress={onConfirm}
        style={styles.button}
      />
    </View>
  );
}

// ─── WithdrawScreen ───────────────────────────────────────────────────────────

export function WithdrawScreen() {
  const router = useRouter();

  const [flowState, setFlowState] = useState<WithdrawFlowState>('form');
  const [selectedAccount, setSelectedAccount] = useState<MockAccount | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isCustomMode = selectedAmount === 'Other';

  const isVerifyEnabled =
    selectedAccount !== null &&
    isValidPhone(phoneNumber) &&
    (isCustomMode ? customAmount.trim().length > 0 : selectedAmount !== null);

  function handleSelectAccount(account: MockAccount) {
    setSelectedAccount(account);
    setIsModalVisible(false);
  }

  function handleSelectAmount(amount: string) {
    setSelectedAmount(amount);
    if (amount !== 'Other') {
      setCustomAmount('');
    }
  }

  function handleVerify() {
    setFlowState('success');
  }

  function handleConfirm() {
    router.back();
  }

  function handleBack() {
    router.back();
  }

  if (flowState === 'success') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <SuccessContent onConfirm={handleConfirm} />
      </SafeAreaView>
    );
  }

  const accountDisplayValue = selectedAccount
    ? maskAccountNumber(selectedAccount.label)
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormHeader onBack={handleBack} />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Illustration */}
          <View style={styles.illustrationWrapper}>
            <WithDrawIllustration width={240} height={200} />
          </View>

          {/* Account field */}
          <ChooseAccountField
            value={accountDisplayValue}
            placeholder="Choose account/ card"
            onPress={() => setIsModalVisible(true)}
          />

          {/* Available balance — shown only after account selected */}
          {selectedAccount !== null && (
            <Text style={styles.balanceText}>
              Available balance : {MOCK_ACCOUNT_BALANCE}
            </Text>
          )}

          {/* Phone input */}
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor={Colors.textMuted}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Phone number"
          />

          {/* Amount section */}
          <Text style={styles.sectionLabel}>Choose amount</Text>
          <ChooseAmount
            presetAmounts={PRESET_AMOUNTS}
            selectedAmount={selectedAmount}
            onSelectAmount={handleSelectAmount}
            allowCustomAmount
            customAmount={customAmount}
            onChangeCustomAmount={setCustomAmount}
          />
        </ScrollView>

        {/* Sticky Verify button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Verify"
            onPress={handleVerify}
            disabled={!isVerifyEnabled}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Account selection modal */}
      <AccountSelectionModal
        visible={isModalVisible}
        accounts={MOCK_ACCOUNTS}
        selectedId={selectedAccount?.id}
        onSelect={handleSelectAccount}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.textBlack,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  balanceText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginTop: -Spacing.sm,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
    backgroundColor: Colors.white,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textBlack,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.white,
  },
  // ── Success ──
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: Spacing.sm,
  },
});
