import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
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

type Currency = {
  code: string;
  name: string;
};

// Mock exchange rates — base: 1 USD. Replace values with API response later.
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  IDR: 15900,
  GBP: 0.79,
  JPY: 149.5,
  SGD: 1.34,
  AUD: 1.52,
  MYR: 4.47,
};

/** Convert amount from one currency to another using the mock rate table. */
function convert(amount: number, from: string, to: string): number {
  const inUSD = amount / (RATES[from] ?? 1);
  return inUSD * (RATES[to] ?? 1);
}

/** Format a number compactly: drop decimals for large values, keep up to 6 for small. */
function formatResult(value: number): string {
  if (value === 0) return "";
  if (value >= 1000)
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return value.toPrecision(4).replace(/\.?0+$/, "");
}

const CURRENCIES: Currency[] = [
  { code: "AUD", name: "Australian Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "USD", name: "US Dollar" },
];

export function ExchangeScreen() {
  const router = useRouter();

  const [fromCurrency, setFromCurrency] = useState<Currency>(CURRENCIES[0]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(CURRENCIES[2]); // IDR
  const [fromAmount, setFromAmount] = useState("");

  // Derived: converted amount and rate label — no extra state needed
  const parsedFrom = parseFloat(fromAmount);
  const toAmount =
    fromAmount.trim().length > 0 && !isNaN(parsedFrom) && parsedFrom > 0
      ? formatResult(convert(parsedFrom, fromCurrency.code, toCurrency.code))
      : "";
  const rateValue = formatResult(
    convert(1, fromCurrency.code, toCurrency.code),
  );
  const rateLabel = `1 ${fromCurrency.code} = ${rateValue} ${toCurrency.code}`;

  // Which picker is open: "from" | "to" | null
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | null>(null);

  const isFormValid =
    fromAmount.trim().length > 0 && parseFloat(fromAmount) > 0;

  function handleSwap() {
    const prevFrom = fromCurrency;
    const prevTo = toCurrency;
    // Compute raw numeric result before swap — toAmount string uses toLocaleString
    // which adds commas (e.g. "15,900"), causing parseFloat to truncate at the comma.
    const parsedFrom = parseFloat(fromAmount);
    const rawConverted =
      fromAmount.trim().length > 0 && !isNaN(parsedFrom) && parsedFrom > 0
        ? convert(parsedFrom, prevFrom.code, prevTo.code)
        : 0;
    setFromCurrency(prevTo);
    setToCurrency(prevFrom);
    setFromAmount(
      rawConverted > 0 ? String(parseFloat(rawConverted.toFixed(8))) : "",
    );
  }

  function handleSelectCurrency(currency: Currency) {
    if (pickerTarget === "from") {
      // Prevent same currency on both sides
      if (currency.code === toCurrency.code) setToCurrency(fromCurrency);
      setFromCurrency(currency);
    } else if (pickerTarget === "to") {
      if (currency.code === fromCurrency.code) setFromCurrency(toCurrency);
      setToCurrency(currency);
    }
    setPickerTarget(null);
  }

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
          Exchange
        </ThemedText>

        {/* Right placeholder */}
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero Illustration ── */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/images/exchange_illustration.png")}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Exchange illustration"
          />
        </View>

        {/* ── Exchange Card ── */}
        <View style={styles.card}>
          {/* ── From Row ── */}
          <ThemedText type="caption" style={styles.fieldLabel}>
            From
          </ThemedText>
          <View style={styles.amountRow}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setPickerTarget("from")}
              accessibilityRole="button"
              accessibilityLabel={`Select from currency, currently ${fromCurrency.code}`}
            >
              <ThemedText style={styles.currencyCode}>
                {fromCurrency.code}
              </ThemedText>
              <Ionicons
                name="chevron-down"
                size={14}
                color={Colors.textLabel}
              />
            </TouchableOpacity>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.textLabel}
              keyboardType="decimal-pad"
              value={fromAmount}
              onChangeText={setFromAmount}
              accessibilityLabel="From amount"
              returnKeyType="done"
            />
          </View>

          {/* ── Swap Button ── */}
          <TouchableOpacity
            onPress={handleSwap}
            accessibilityRole="button"
            accessibilityLabel="Swap currencies"
          >
            <Image
              source={require("@/assets/images/exchange_arrow.png")}
              style={styles.arrowImage}
              resizeMode="contain"
              accessibilityLabel="Swap"
            />
          </TouchableOpacity>

          {/* ── To Row ── */}
          <ThemedText type="caption" style={styles.fieldLabel}>
            To
          </ThemedText>
          <View style={[styles.amountRow, styles.amountRowReadonly]}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setPickerTarget("to")}
              accessibilityRole="button"
              accessibilityLabel={`Select to currency, currently ${toCurrency.code}`}
            >
              <ThemedText style={styles.currencyCode}>
                {toCurrency.code}
              </ThemedText>
              <Ionicons
                name="chevron-down"
                size={14}
                color={Colors.textLabel}
              />
            </TouchableOpacity>
            <View style={styles.inputDivider} />
            <TextInput
              style={[styles.amountInput, styles.amountInputReadonly]}
              placeholder="0"
              placeholderTextColor={Colors.textLabel}
              keyboardType="decimal-pad"
              value={toAmount}
              editable={false}
              accessibilityLabel="To amount"
            />
          </View>

          {/* ── Currency Rate hint ── */}
          <View style={styles.rateSection}>
            <ThemedText type="caption" style={styles.rateTitle}>
              Curency rate
            </ThemedText>
            <ThemedText type="caption" style={styles.rateHint}>
              {rateLabel}
            </ThemedText>
          </View>

          {/* ── Exchange Button ── */}
          <ThemedButton
            title="Exchange"
            variant="primary"
            disabled={!isFormValid}
            onPress={() => router.push("/pay-the-bill")}
            style={styles.exchangeButton}
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

      {/* ── Currency Picker Modal ── */}
      <Modal
        visible={pickerTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerTarget(null)}
      >
        {/* Full-screen overlay — tap outside to close */}
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPickerTarget(null)}
        >
          {/* Centered popup card — stop propagation so tapping inside does NOT close */}
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => setPickerTarget(null)}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              ></Pressable>
              <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                Select the currency
              </ThemedText>
              <Pressable
                onPress={() => setPickerTarget(null)}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </Pressable>
            </View>

            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              style={styles.currencyList}
              renderItem={({ item }) => {
                const isSelected =
                  pickerTarget === "from"
                    ? item.code === fromCurrency.code
                    : item.code === toCurrency.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.currencyItem,
                      isSelected && styles.currencyItemSelected,
                    ]}
                    onPress={() => handleSelectCurrency(item)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <ThemedText
                      style={[
                        styles.currencyItemLabel,
                        isSelected && styles.currencyItemLabelSelected,
                      ]}
                    >
                      {item.code}{" "}
                      <ThemedText
                        style={[
                          styles.currencyItemParen,
                          isSelected && styles.currencyItemParenSelected,
                        ]}
                      >
                        ({item.name})
                      </ThemedText>
                    </ThemedText>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={22}
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
    paddingBottom: Spacing.xl,
  },

  // ── Hero ──
  heroSection: {
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },

  // ── Card ──
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  // ── Field label ──
  fieldLabel: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: Fonts.semiBold,
    marginBottom: Spacing.xs,
  },

  // ── Amount Row ──
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "#EBEBF0",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.md,
  },
  amountRowReadonly: {
    backgroundColor: "#F3F4F8",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 30,
  },
  currencyCode: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
  },
  inputDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.primary,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
    textAlign: "right",
    padding: 0,
  },
  amountInputReadonly: {
    color: Colors.textMuted,
  },

  // ── Swap Button ──

  arrowImage: {
    alignSelf: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm + 2,
    width: 45,
    height: 30,
  },

  rateSection: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  // ── Rate hint ──
  rateTitle: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },

  rateHint: {
    color: Colors.textDark,
    fontSize: 14,
  },

  // ── Exchange Button ──
  exchangeButton: {
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    width: "100%",
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
  currencyList: {
    // ~5 items × (paddingVertical(11*2) + fontSize(18*lineHeight~1.4)) ≈ 56px each
    maxHeight: 240,
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
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm + 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  currencyItemSelected: {
    backgroundColor: "#F0EEFF",
  },
  currencyItemLabel: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
    flexShrink: 1,
  },
  currencyItemLabelSelected: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
  currencyItemParen: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  currencyItemParenSelected: {
    color: Colors.primary,
  },
});
