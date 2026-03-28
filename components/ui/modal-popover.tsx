import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";

type ModalPopoverProps = {
  /** Whether the modal is visible */
  visible: boolean;
  /** List of options to display */
  options: string[];
  /** Optional display labels for each option (same order as options) */
  optionLabels?: string[];
  /** Currently selected option */
  selectedOption: string;
  /** Called when an option is selected */
  onSelect: (option: string) => void;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /** Optional title shown at the top of the modal */
  title?: string;
};

export function ModalPopover({
  visible,
  options,
  optionLabels,
  selectedOption,
  onSelect,
  onClose,
  title,
}: ModalPopoverProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          {title ? (
            <View style={styles.header}>
              <ThemedText style={styles.title}>{title}</ThemedText>
            </View>
          ) : null}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color={Colors.closeIcon} />
          </Pressable>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {options.map((option, index) => {
              const isSelected = selectedOption === option;
              const displayLabel = optionLabels?.[index] ?? option;
              return (
                <Pressable
                  key={option}
                  style={styles.item}
                  onPress={() => onSelect(option)}
                >
                  <ThemedText
                    style={[styles.itemText, isSelected && styles.itemTextSelected]}
                  >
                    {displayLabel}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={Colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(121,121,121,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  sheet: {
    width: "100%",
    maxHeight: 272,
    backgroundColor: Colors.white,
    borderRadius: Radius.md - 2,
    paddingHorizontal: Spacing.lg,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textBlack,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },

  itemText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.labelText,
  },
  itemTextSelected: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
});
