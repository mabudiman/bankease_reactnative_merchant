import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { useTranslation } from "@/core/i18n";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import { authService } from "@/features/auth/services/auth-service";
import { dashboardService } from "@/features/dashboard/services/dashboard-service";
import type { PaymentCard } from "@/features/dashboard/types";
import { MOCK_PREPAID_AMOUNTS } from "@/mocks/data";
import { useBeneficiaries, usePrepaidPurchase } from "../hooks";
import { AccountPickerSheet } from "./AccountPickerSheet";
import { BeneficiaryDirectory } from "./BeneficiaryDirectory";
import { AmountChips } from "./AmountChips";
import type { Beneficiary } from "../types";

export function MobilePrepaidScreen() {
  const { t } = useTranslation();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(
    null,
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const { data: beneficiaries = [] } = useBeneficiaries();
  const purchaseMutation = usePrepaidPurchase();

  // ─── Load cards on focus ────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const account = await authService.getSessionAccount();
        if (!account || cancelled) return;
        const loaded = await dashboardService.loadCards(account.id);
        if (!cancelled) setCards(loaded);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────
  function handleCardSelect(card: PaymentCard) {
    setSelectedCard(card);
    setPickerVisible(false);
  }

  function handleBeneficiarySelect(ben: Beneficiary) {
    setSelectedBeneficiary(ben);
    setPhoneNumber(ben.phoneNumber);
  }

  function handleAddBeneficiary() {
    Alert.alert(t("mobilePrepaid.addBeneficiary.title"));
  }

  const isFormValid =
    selectedCard !== null && phoneNumber.trim().length > 0 && selectedAmount !== null;

  async function handleConfirm() {
    if (!isFormValid || !selectedCard || !selectedAmount) return;

    purchaseMutation.mutate(
      {
        cardId: selectedCard.id,
        beneficiaryId: selectedBeneficiary?.id,
        phoneNumber: phoneNumber.trim(),
        amount: selectedAmount,
      },
      {
        onSuccess: () => {
          router.push("/mobile-prepaid-success" as never);
        },
        onError: () => {
          Alert.alert("Error", "Transaction failed. Please try again.");
        },
      },
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>{t("mobilePrepaid.title")}</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Account / Card Selector */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>
              {t("mobilePrepaid.chooseAccount")}
            </ThemedText>
            <Pressable
              style={styles.cardSelector}
              onPress={() => setPickerVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={t("mobilePrepaid.chooseAccount")}
            >
              <ThemedText
                style={
                  selectedCard ? styles.cardSelectorText : styles.cardSelectorPlaceholder
                }
              >
                {selectedCard
                  ? `${selectedCard.brand} ${selectedCard.maskedNumber}`
                  : t("mobilePrepaid.chooseAccount")}
              </ThemedText>
              <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
            </Pressable>
            {selectedCard && (
              <ThemedText style={styles.balanceText}>
                {t("mobilePrepaid.availableBalance").replace(
                  "{{balance}}",
                  formatCurrency(selectedCard.balance, selectedCard.currency),
                )}
              </ThemedText>
            )}
          </View>

          {/* Beneficiary Directory */}
          <View style={styles.section}>
            <BeneficiaryDirectory
              beneficiaries={beneficiaries}
              selectedId={selectedBeneficiary?.id ?? null}
              onSelect={handleBeneficiarySelect}
              onAdd={handleAddBeneficiary}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>
              {t("mobilePrepaid.phoneNumber")}
            </ThemedText>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={t("mobilePrepaid.phoneNumberPlaceholder")}
              placeholderTextColor={Colors.placeholderText}
              keyboardType="phone-pad"
              accessibilityLabel={t("mobilePrepaid.phoneNumber")}
            />
          </View>

          {/* Amount Chips */}
          <View style={styles.section}>
            <AmountChips
              amounts={MOCK_PREPAID_AMOUNTS}
              selectedValue={selectedAmount}
              onSelect={setSelectedAmount}
            />
          </View>
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.footer}>
          <ThemedButton
            title={t("mobilePrepaid.confirm")}
            onPress={handleConfirm}
            disabled={!isFormValid || purchaseMutation.isPending}
            loading={purchaseMutation.isPending}
            accessibilityLabel={t("mobilePrepaid.confirm")}
            lightColor={Colors.primary}
          />
        </View>

        {/* Account Picker Modal */}
        <AccountPickerSheet
          visible={pickerVisible}
          cards={cards}
          selectedCardId={selectedCard?.id ?? null}
          onSelect={handleCardSelect}
          onClose={() => setPickerVisible(false)}
        />
      </KeyboardAvoidingView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textBlack,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 20,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  cardSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardSelectorText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textBlack,
  },
  cardSelectorPlaceholder: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.placeholderText,
  },
  balanceText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textBlack,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
