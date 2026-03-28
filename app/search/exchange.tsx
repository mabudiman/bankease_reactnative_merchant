import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ThemedText } from "@/components/ui/themed-text";
import { Card } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { InputWithSelector } from "@/components/ui/input-with-selector";
import {
  CURRENCIES,
  CURRENCY_LIST,
  convertAmount,
  formatResult,
} from "@/features/search/services/currency";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";

const HERO = require("@/assets/images/illustrations/exchange-illustration.png");
const SWAP = require("@/assets/images/icons/swap-icon.png");

export default function ExchangeScreen() {
  const { t } = useTranslation();
  const ts = (key: string) => t(`searchScreen.${key}`);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [fromAmount, setFromAmount] = useState("1");

  const toAmount = useMemo(() => {
    const parsed = parseFloat(fromAmount);
    if (!isNaN(parsed) && parsed > 0) {
      return formatResult(convertAmount(parsed, fromCurrency, toCurrency));
    }
    return "0";
  }, [fromAmount, fromCurrency, toCurrency]);

  const rateLabel = useMemo(
    () =>
      `1 ${fromCurrency} = ${formatResult(convertAmount(1, fromCurrency, toCurrency))} ${toCurrency}`,
    [fromCurrency, toCurrency],
  );

  const handleSwap = () => {
    const raw = parseFloat(fromAmount);
    const converted =
      !isNaN(raw) && raw > 0 ? convertAmount(raw, fromCurrency, toCurrency) : 0;
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // parseFloat(toFixed) drops trailing zeros and avoids floating-point noise
    setFromAmount(converted > 0 ? String(parseFloat(converted.toFixed(8))) : "1");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={ts("exchangeTitle")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Hero illustration */}
        <Image source={HERO} style={styles.hero} resizeMode="contain" />

        {/* 3. Exchange Card */}
        <Card>
          {/* Row 1: cost */}
          <InputWithSelector
            label={ts("from")}
            value={fromAmount}
            onChangeText={setFromAmount}
            selectedOption={fromCurrency}
            options={CURRENCIES}
            optionLabels={CURRENCY_LIST.map((c) => c.label)}
            onSelectOption={setFromCurrency}
            modalTitle={ts("selectCurrency")}
          />

          {/* Swap */}
          <View style={styles.swapCenter}>
            <Pressable
              onPress={handleSwap}
              accessibilityRole="button"
              accessibilityLabel="Swap currencies"
            >
              <Image source={SWAP} style={styles.swapButton} resizeMode="contain" />
            </Pressable>
          </View>

          {/* Row 2: currency you send */}
          <InputWithSelector
            label={ts("to")}
            value={toAmount}
            selectedOption={toCurrency}
            options={CURRENCIES}
            optionLabels={CURRENCY_LIST.map((c) => c.label)}
            onSelectOption={setToCurrency}
            modalTitle={ts("selectCurrency")}
          />

          <View style={styles.rateRow}>
            <ThemedText style={styles.rateRowLabel}>{ts("currencyRate")}</ThemedText>
            <ThemedText style={styles.rateRowValue}>{rateLabel}</ThemedText>
          </View>
          <PrimaryButton
            title={ts("exchangeButton")}
            onPress={handleSwap}
            marginBottom={0}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm + 4,
  },
  rateRowLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.primary,
  },
  rateRowValue: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.inputBorderLight,
    borderRadius: Radius.sm,
    overflow: "hidden",
    minHeight: 48,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textBlack,
  },
  resultText: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textBlack,
  },
  currencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.inputBorderLight,
    backgroundColor: "#F9FAFB",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  currencyText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textBlack,
  },
  swapCenter: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  swapButton: {
    width: 46,
    height: 24,
  },
});
