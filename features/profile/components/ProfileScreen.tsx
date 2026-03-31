import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { useProfile } from '../hooks/useProfile';
import type { UserProfileInput } from '../types';

const AVATAR_SIZE = 88;
const AVATAR_HALF = AVATAR_SIZE / 2;

// Form field style tokens (white area)
const FIELD_BORDER = 'rgba(0, 0, 0, 0.12)';
const FIELD_LABEL_COLOR = '#8E8BA2';

interface FieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (v: string) => void;
  readonly placeholder?: string;
  readonly keyboardType?: 'default' | 'numeric' | 'email-address';
  readonly autoCapitalize?: 'none' | 'sentences' | 'words';
}

function FormField({ label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'words' }: FieldProps) {
  return (
    <View style={styles.fieldWrapper}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor="#BABABA"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { user, profile, isLoading, isSaving, saveProfile } = useProfile();

  // Local form state (controlled inputs)
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [transactionName, setTransactionName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Snapshot of the last confirmed-good values — used to revert on failure
  const snapshot = useRef({ bankName: '', branchName: '', transactionName: '', cardNumber: '' });
  // Only populate fields once on initial load (not on every profile state change)
  const hasPopulated = useRef(false);

  useEffect(() => {
    if (profile && !hasPopulated.current) {
      hasPopulated.current = true;
      const vals = {
        bankName: profile.bankName,
        branchName: profile.branchName,
        transactionName: profile.transactionName,
        cardNumber: profile.cardNumber,
      };
      setBankName(vals.bankName);
      setBranchName(vals.branchName);
      setTransactionName(vals.transactionName);
      setCardNumber(vals.cardNumber);
      setDisplayName(profile.transactionName || user?.name || '');
      snapshot.current = vals;
    }
  }, [profile, user?.name]);

  const isAllFilled =
    bankName.trim().length > 0 &&
    branchName.trim().length > 0 &&
    transactionName.trim().length > 0 &&
    cardNumber.trim().length > 0;

  async function handleConfirm() {
    if (isSaving || !isAllFilled) return;
    const data: UserProfileInput = {
      bankName: bankName.trim(),
      branchName: branchName.trim(),
      transactionName: transactionName.trim(),
      cardNumber: cardNumber.trim(),
      cardProvider: profile?.cardProvider ?? '',
      currency: profile?.currency ?? '',
    };
    const success = await saveProfile(data);
    if (success) {
      // Update snapshot so future failures revert to the newly saved values
      snapshot.current = {
        bankName: bankName.trim(),
        branchName: branchName.trim(),
        transactionName: transactionName.trim(),
        cardNumber: cardNumber.trim(),
      };
      // Update displayed name at the top to reflect the new transaction name
      setDisplayName(transactionName.trim() || user?.name || '');
    } else {
      // Revert form to the last successfully saved / loaded values
      setBankName(snapshot.current.bankName);
      setBranchName(snapshot.current.branchName);
      setTransactionName(snapshot.current.transactionName);
      setCardNumber(snapshot.current.cardNumber);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Purple header ── */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView edges={['top']} style={styles.headerSafe}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={26} color={Colors.white} />
              </Pressable>
              <ThemedText style={styles.headerTitle}>Profile</ThemedText>
              {/* Spacer to center title */}
              <View style={styles.headerSpacer} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── White card ── */}
        <View style={styles.card}>
          {/* Floating avatar — position absolute above the card top edge */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              {profile?.image ? (
                <Image
                  source={{ uri: profile.image }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={40} color={Colors.primary} />
              )}
            </View>
          </View>

          {/* User name */}
          <ThemedText style={styles.userName}>
            {isLoading ? '...' : displayName}
          </ThemedText>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loader}
            />
          ) : (
            <>
              {/* Form fields */}
              <FormField
                label="Choose bank"
                value={bankName}
                onChangeText={setBankName}
              />
              <FormField
                label="Choose branch"
                value={branchName}
                onChangeText={setBranchName}
              />
              <FormField
                label="Transaction name"
                value={transactionName}
                onChangeText={setTransactionName}
              />
              <FormField
                label="Card number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                autoCapitalize="none"
              />

              {/* Confirm button */}
              <Pressable
                style={({ pressed }) => [
                  styles.confirmButton,
                  pressed && styles.confirmButtonPressed,
                  (!isAllFilled || isSaving) && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!isAllFilled || isSaving}
                accessibilityRole="button"
                accessibilityLabel="Confirm"
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
                )}
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // ── Header ──
  header: {
    paddingBottom: AVATAR_HALF,
  },
  headerSafe: {
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 36,
  },
  // ── White card ──
  card: {
    flex: 1,
    backgroundColor: Colors.bottomSheet,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -AVATAR_HALF,
    // overflow visible so avatar (absolute) sticks up above card edge
    overflow: 'visible',
    paddingTop: AVATAR_HALF + 16,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // ── Avatar ──
  avatarWrapper: {
    position: 'absolute',
    top: -AVATAR_HALF,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_HALF,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_HALF,
  },
  // ── User name ──
  userName: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 28,
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
  // ── Form field ──
  fieldWrapper: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    color: FIELD_LABEL_COLOR,
    marginBottom: 6,
    fontWeight: '500',
  },
  fieldInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textBlack,
  },
  // ── Confirm button ──
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
