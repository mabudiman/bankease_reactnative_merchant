import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Radius } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import { authService } from "@/features/auth/services/auth-service";
import { useMobilePrepaid } from "../hooks/useMobilePrepaid";
import { AmountChips } from "./AmountChips";
import { BeneficiaryDirectory } from "./BeneficiaryDirectory";
import { CardSelectorSheet } from "./CardSelectorSheet";
import { PrepaidSuccessView } from "./PrepaidSuccessView";

interface MobilePrepaidScreenInnerProps {
  accountId: string;
}

function MobilePrepaidScreenInner({ accountId }: MobilePrepaidScreenInnerProps) {
  const router = useRouter();
  const {
    cards,
    beneficiaries,
    isLoading,
    selectedCard,
    selectedAmount,
    phone,
    selectedBeneficiaryId,
    setSelectedCard,
    setSelectedAmount,
    setPhone,
    selectBeneficiary,
    submit,
    isSubmitting,
    isSuccess,
  } = useMobilePrepaid(accountId);

  const [sheetVisible, setSheetVisible] = useState(false);

  const isAllFilled = !!selectedCard && !!phone && !!selectedAmount;

  if (isSuccess) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <PrepaidSuccessView />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color="#343434" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Mobile prepaid</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card selector */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Choose account/ card</ThemedText>
          <Pressable
            style={styles.cardField}
            onPress={() => setSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Choose account or card"
          >
            <ThemedText
              style={[styles.cardFieldText, !selectedCard && styles.cardFieldPlaceholder]}
            >
              {selectedCard
                ? `${selectedCard.brand} ${selectedCard.maskedNumber}`
                : "Choose account / card"}
            </ThemedText>
          </Pressable>
          {selectedCard && (
            <ThemedText style={styles.balanceText}>
              Available balance :{" "}
              {formatCurrency(selectedCard.balance, selectedCard.currency)}
            </ThemedText>
          )}
        </View>

        {/* Beneficiary directory */}
        <View style={styles.section}>
          <BeneficiaryDirectory
            beneficiaries={beneficiaries}
            selectedId={selectedBeneficiaryId}
            onSelect={selectBeneficiary}
          />
        </View>

        {/* Phone number */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Phone number</ThemedText>
          <TextInput
            style={styles.textInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor="#9E9E9E"
            keyboardType="phone-pad"
            accessibilityLabel="Phone number"
          />
        </View>

        {/* Amount chips */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Choose amount</ThemedText>
          <AmountChips selected={selectedAmount} onSelect={setSelectedAmount} />
        </View>

        {/* Spacer to push Confirm to bottom */}
        <View style={styles.spacer} />

        {/* Confirm button */}
        <Pressable
          style={[
            styles.confirmButton,
            (!isAllFilled || isSubmitting) && styles.confirmDisabled,
          ]}
          onPress={submit}
          disabled={!isAllFilled || isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Confirm"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.confirmText}>Confirm</ThemedText>
          )}
        </Pressable>
      </ScrollView>

      {/* Card selector bottom sheet */}
      <CardSelectorSheet
        visible={sheetVisible}
        cards={cards}
        selectedCardId={selectedCard?.id ?? null}
        onSelect={setSelectedCard}
        onClose={() => setSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

export function MobilePrepaidScreen() {
  const [accountId, setAccountId] = useState<string | null>(null);

  React.useEffect(() => {
    authService.getSessionAccount().then((account) => {
      if (account) {
        setAccountId(account.id);
      }
    });
  }, []);

  if (!accountId) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return <MobilePrepaidScreenInner accountId={accountId} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#343434",
  },
  headerSpacer: {
    width: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  section: {
    marginTop: 20,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#687076",
  },
  cardField: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
  },
  cardFieldText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#343434",
  },
  cardFieldPlaceholder: {
    color: "#9E9E9E",
  },
  balanceText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: Colors.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#343434",
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  confirmButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginTop: 16,
  },
  confirmDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
  },
});
