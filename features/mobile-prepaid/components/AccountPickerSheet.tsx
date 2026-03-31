import React, { memo } from "react";
import { View, Modal, StyleSheet, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { useTranslation } from "@/core/i18n";
import { Colors, Fonts, Radius } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import type { PaymentCard } from "@/features/dashboard/types";

interface AccountPickerSheetProps {
  visible: boolean;
  cards: PaymentCard[];
  selectedCardId: string | null;
  onSelect: (card: PaymentCard) => void;
  onClose: () => void;
}

function AccountPickerSheetComponent({
  visible,
  cards,
  selectedCardId,
  onSelect,
  onClose,
}: AccountPickerSheetProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{t("mobilePrepaid.selectCard")}</ThemedText>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={24} color={Colors.textBlack} />
            </Pressable>
          </View>

          {cards.length === 0 ? (
            <ThemedText style={styles.empty}>{t("mobilePrepaid.noCards")}</ThemedText>
          ) : (
            <FlatList
              data={cards}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedCardId === item.id;
                return (
                  <Pressable
                    style={[styles.cardRow, isSelected && styles.cardRowSelected]}
                    onPress={() => onSelect(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.brand} ${item.maskedNumber}`}
                  >
                    <View style={styles.cardInfo}>
                      <ThemedText style={styles.cardLabel}>{item.cardLabel}</ThemedText>
                      <ThemedText style={styles.cardNumber}>
                        {item.brand} {item.maskedNumber}
                      </ThemedText>
                      <ThemedText style={styles.cardBalance}>
                        {formatCurrency(item.balance, item.currency)}
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

export const AccountPickerSheet = memo(AccountPickerSheetComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textBlack,
  },
  empty: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: "center",
    paddingVertical: 20,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  cardRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.textBlack,
  },
  cardNumber: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  cardBalance: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginTop: 2,
  },
});
