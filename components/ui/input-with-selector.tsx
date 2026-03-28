import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  type LayoutRectangle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ModalPopover } from "@/components/ui/modal-popover";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";

type InputWithSelectorProps = {
  /** Current value shown in the input/display area */
  label?: string;
  value: string;
  /** If provided, renders an editable TextInput; otherwise renders read-only text */
  onChangeText?: (text: string) => void;
  /** The currently selected option shown in the badge */
  selectedOption: string;
  /** List of options available in the picker */
  options: string[];
  /** Optional display labels for each option (same order as options) */
  optionLabels?: string[];
  /** Called when the user picks an option */
  onSelectOption: (option: string) => void;
  /** Optional small label shown at the top of the dropdown */
  modalTitle?: string;
  /** Placeholder text (only applies when onChangeText is provided) */
  placeholder?: string;
};

export function InputWithSelector({
  label,
  value,
  onChangeText,
  selectedOption,
  options,
  optionLabels,
  onSelectOption,
  modalTitle,
  placeholder = "0",
}: InputWithSelectorProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);
  const triggerRef = useRef<View>(null);

  const openDropdown = () => {
    triggerRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setAnchor({ x: px, y: py, width, height });
      setDropdownVisible(true);
    });
  };

  return (
    <>
      {label ? <ThemedText style={styles.fieldLabel}>{label}</ThemedText> : null}
      <View style={styles.inputRow}>
        {onChangeText ? (
          <TextInput
            style={styles.amountInput}
            keyboardType="decimal-pad"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textMuted}
          />
        ) : (
          <ThemedText style={styles.amountInput}>{value}</ThemedText>
        )}

        <Pressable
          ref={triggerRef}
          style={styles.selectorBadge}
          onPress={openDropdown}
          accessibilityRole="button"
          accessibilityLabel={`Select, current: ${selectedOption}`}
        >
          <View style={styles.divider} />
          <ThemedText style={styles.selectorText}>{selectedOption}</ThemedText>
          <Ionicons
            name={dropdownVisible ? "chevron-up" : "chevron-down"}
            size={14}
            color={Colors.textMuted}
          />
        </Pressable>
      </View>

      <ModalPopover
        visible={dropdownVisible}
        options={options}
        optionLabels={optionLabels}
        selectedOption={selectedOption}
        onSelect={(option: string) => {
          onSelectOption(option);
          setDropdownVisible(false);
        }}
        onClose={() => setDropdownVisible(false)}
        title={modalTitle}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.labelText,
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: Radius.md,
    overflow: "hidden",
    minHeight: 42,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: Spacing.md - 4,
    paddingVertical: Spacing.md - 4,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textBlack,
  },
  selectorBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: Spacing.md - 4,
    paddingVertical: Spacing.sm,
  },
  selectorText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.textBlack,
    marginRight: Spacing.md - 2,
    marginLeft: Spacing.md + 3,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderInput,
    height: 32,
  },
});
