import React, { useRef, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  type LayoutRectangle,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ModalPopover } from "@/components/ui/modal-popover";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";

type SelectorInputProps = {
  /** Optional label shown above the selector */
  label?: string;
  /** Currently selected option value. Empty string = nothing selected */
  selectedOption: string;
  /** Text shown when nothing is selected */
  placeholder?: string;
  /** List of option values */
  options: string[];
  /** Optional display labels for each option (same order as options) */
  optionLabels?: string[];
  /** Called when the user picks an option */
  onSelectOption: (option: string) => void;
  /** Optional title shown at the top of the modal */
  modalTitle?: string;
  style?: StyleProp<ViewStyle>;
};

export function SelectorInput({
  label,
  selectedOption,
  placeholder,
  options,
  optionLabels,
  onSelectOption,
  modalTitle,
  style,
}: SelectorInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);
  const triggerRef = useRef<View>(null);

  const openModal = () => {
    triggerRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setAnchor({ x: px, y: py, width, height });
      setModalVisible(true);
    });
  };

  const selectedIndex = options.indexOf(selectedOption);
  const displayText =
    selectedOption && optionLabels && selectedIndex >= 0
      ? optionLabels[selectedIndex]
      : selectedOption;

  return (
    <>
      <View style={style}>
        {label ? <ThemedText style={styles.fieldLabel}>{label}</ThemedText> : null}
        <Pressable
          ref={triggerRef}
          style={styles.selector}
          onPress={openModal}
          accessibilityRole="button"
          accessibilityLabel={`Select, current: ${selectedOption}`}
        >
          <ThemedText
            style={[styles.selectorText, !selectedOption && styles.selectorPlaceholder]}
          >
            {displayText || placeholder}
          </ThemedText>
          <Ionicons
            name={modalVisible ? "chevron-up" : "chevron-down"}
            size={14}
            color={Colors.textMuted}
          />
        </Pressable>
      </View>

      <ModalPopover
        visible={modalVisible}
        options={options}
        optionLabels={optionLabels}
        selectedOption={selectedOption}
        onSelect={(option: string) => {
          onSelectOption(option);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
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
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: Radius.md,
    minHeight: 42,
    paddingHorizontal: Spacing.md - 4,
    paddingVertical: Spacing.md - 4,
  },
  selectorText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textBlack,
    marginRight: Spacing.xs,
  },
  selectorPlaceholder: {
    color: Colors.placeholderText,
  },
});
