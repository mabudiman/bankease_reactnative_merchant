import React from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import type { MockAccount } from "@/features/withdraw/types";

export interface AccountSelectionModalProps {
  readonly visible: boolean;
  readonly accounts: readonly MockAccount[];
  readonly selectedId?: string;
  readonly onSelect: (account: MockAccount) => void;
  readonly onClose: () => void;
}

// ─── Module-level sub-component (S6478) ──────────────────────────────────────

interface AccountItemProps {
  readonly account: MockAccount;
  readonly selected: boolean;
  readonly onPress: () => void;
}

function AccountItem({ account, selected, onPress }: AccountItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={account.label}
      accessibilityState={{ selected }}
      style={styles.item}
    >
      <Text
        style={[
          styles.itemLabel,
          selected ? styles.itemLabelSelected : styles.itemLabelDefault,
        ]}
      >
        {account.label}
      </Text>
      {selected && (
        <Ionicons
          name="checkmark"
          size={18}
          color={Colors.primary}
          style={styles.checkIcon}
        />
      )}
    </Pressable>
  );
}

// ─── AccountSelectionModal ────────────────────────────────────────────────────

export function AccountSelectionModal({
  visible,
  accounts,
  selectedId,
  onSelect,
  onClose,
}: AccountSelectionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop — pressing outside closes */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner card — absorbs touch so pressing it does NOT close */}
        <Pressable
          style={styles.card}
          onPress={() => {
            /* absorb */
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose account:</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={Colors.textBlack} />
            </Pressable>
          </View>

          {/* Account list */}
          <FlatList
            data={accounts as MockAccount[]}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <AccountItem
                account={item}
                selected={item.id === selectedId}
                onPress={() => onSelect(item)}
              />
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    position: "relative",
    minHeight: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textBlack,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    position: "relative",
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  checkIcon: {
    position: "absolute",
    right: 0,
  },
  itemLabelDefault: {
    color: Colors.textMuted,
  },
  itemLabelSelected: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
});
