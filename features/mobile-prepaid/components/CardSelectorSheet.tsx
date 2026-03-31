// features/mobile-prepaid/components/CardSelectorSheet.tsx
import React, { memo } from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import type { PaymentCard } from "@/features/dashboard/types";

interface CardSelectorSheetProps {
  visible: boolean;
  cards: PaymentCard[];
  selectedCardId: string | null;
  onSelect: (card: PaymentCard) => void;
  onClose: () => void;
}

function CardSelectorSheetComponent({
  visible,
  cards,
  selectedCardId,
  onSelect,
  onClose,
}: CardSelectorSheetProps) {
  function handleSelect(card: PaymentCard) {
    onSelect(card);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <ThemedText style={styles.title}>Select card</ThemedText>

          {cards.map((card) => {
            const isSelected = selectedCardId === card.id;
            return (
              <Pressable
                key={card.id}
                style={[styles.cardRow, isSelected && styles.cardRowSelected]}
                onPress={() => handleSelect(card)}
                accessibilityRole="button"
                accessibilityLabel={`${card.brand} ${card.maskedNumber}`}
              >
                <View style={styles.cardInfo}>
                  <ThemedText style={styles.brandText}>{card.brand}</ThemedText>
                  <ThemedText style={styles.maskedNumber}>{card.maskedNumber}</ThemedText>
                </View>
                <ThemedText style={styles.balance}>
                  {formatCurrency(card.balance, card.currency)}
                </ThemedText>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const CardSelectorSheet = memo(CardSelectorSheetComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#343434",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 12,
  },
  cardRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  brandText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#687076",
  },
  maskedNumber: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#343434",
  },
  balance: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: Colors.primary,
  },
});
