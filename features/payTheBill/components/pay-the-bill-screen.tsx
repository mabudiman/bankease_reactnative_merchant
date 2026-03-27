import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius, Fonts } from "@/constants/theme";

type Company = {
  id: string;
  name: string;
  category: string;
};

const COMPANIES: Company[] = [
  { id: "indihome", name: "IndiHome", category: "Internet & TV" },
  { id: "telkomsel", name: "Telkomsel", category: "Mobile" },
  { id: "indosat", name: "Indosat Ooredoo", category: "Mobile" },
  { id: "xl", name: "XL Axiata", category: "Mobile" },
  { id: "axis", name: "AXIS", category: "Mobile" },
  { id: "smartfren", name: "Smartfren", category: "Mobile" },
  { id: "pln", name: "PLN", category: "Electricity" },
  { id: "pdam", name: "PDAM", category: "Water" },
  { id: "bpjs_kesehatan", name: "BPJS Kesehatan", category: "Insurance" },
  {
    id: "bpjs_ketenagakerjaan",
    name: "BPJS Ketenagakerjaan",
    category: "Insurance",
  },
  { id: "firstmedia", name: "First Media", category: "Internet & TV" },
  { id: "biznet", name: "Biznet", category: "Internet & TV" },
];

export function PayTheBillScreen() {
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [companyPickerOpen, setCompanyPickerOpen] = useState(false);
  const [billCode, setBillCode] = useState("");

  const isFormValid = company !== null && billCode.trim().length > 0;

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerSide}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
        >
          <View style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={Colors.textDark} />
          </View>
        </Pressable>

        <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
          Pay the Bill
        </ThemedText>

        <View style={styles.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Currency Input Card ── */}
        <View style={styles.card}>
          {/* ── Company Selector ── */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setCompanyPickerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={
                company ? `Company: ${company.name}` : "Choose company"
              }
            >
              <View style={styles.selectorRow}>
                <ThemedText
                  style={[styles.textInput, !company && styles.placeholderText]}
                >
                  {company ? company.name : "Choose company"}
                </ThemedText>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={Colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* ── Bill Code Input ── */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.fieldLabel}>
              Type the bill code
            </ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Bill code"
                placeholderTextColor={Colors.placeholderText}
                value={billCode}
                onChangeText={setBillCode}
                accessibilityLabel="Bill code"
                returnKeyType="done"
              />
            </View>
          </View>
          <ThemedText style={styles.fieldInfo}>
            Please enter the correct bill code to check information.
          </ThemedText>
          {/* ── Pay Button ── */}
          <ThemedButton
            title="Check"
            variant="primary"
            disabled={!isFormValid}
            style={styles.payButton}
            onPress={() => router.push("/bill-details")}
            lightColor={isFormValid ? Colors.primary : Colors.buttonDisabled}
            darkColor={isFormValid ? Colors.primary : Colors.buttonDisabled}
            lightTextColor={
              isFormValid ? Colors.white : Colors.buttonDisabledText
            }
            darkTextColor={
              isFormValid ? Colors.white : Colors.buttonDisabledText
            }
            accessibilityLabel="Exchange"
          />
        </View>
      </ScrollView>

      {/* ── Company Picker Modal ── */}
      <Modal
        visible={companyPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCompanyPickerOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCompanyPickerOpen(false)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Pressable style={styles.closeButton} />
              <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                Select Company
              </ThemedText>
              <Pressable
                style={styles.closeButton}
                onPress={() => setCompanyPickerOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </Pressable>
            </View>

            <FlatList
              data={COMPANIES}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator
              style={styles.companyList}
              renderItem={({ item }) => {
                const isSelected = company?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.companyItem,
                      isSelected && styles.companyItemSelected,
                    ]}
                    onPress={() => {
                      setCompany(item);
                      setCompanyPickerOpen(false);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <View style={styles.companyItemContent}>
                      <ThemedText
                        style={[
                          styles.companyItemName,
                          isSelected && styles.companyItemNameSelected,
                        ]}
                      >
                        {item.name}
                      </ThemedText>
                      <ThemedText style={styles.companyItemCategory}>
                        {item.category}
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "#F5F6FA",
  },
  headerSide: {
    width: 40,
    alignItems: "flex-start",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.textDark,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
  },

  // ── ScrollView ──
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // ── Currency Input Card ──
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  // ── Input Groups ──
  inputGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  fieldInfo: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "#EBEBF0",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
    padding: 0,
    flex: 1,
  },
  placeholderText: {
    color: Colors.placeholderText,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ── Pay Button ──
  payButton: {
    borderRadius: Radius.md,
    width: "100%",
    marginTop: Spacing.sm,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm + 6,
  },
  modalTitle: {
    fontSize: 20,
    color: Colors.textDark,
    fontFamily: Fonts.semiBold,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: "#F3F4F8",
    alignItems: "center",
    justifyContent: "center",
  },
  companyList: {
    maxHeight: 280,
  },
  companyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm + 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  companyItemSelected: {
    backgroundColor: "#F0EEFF",
  },
  companyItemContent: {
    flex: 1,
  },
  companyItemName: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
  },
  companyItemNameSelected: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
  companyItemCategory: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
