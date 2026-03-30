import { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ExchangeHero } from "@/features/search/components/ExchangeHero";
import { ExchangeFormCard } from "@/features/search/components/ExchangeFormCard";
import { convertAmount, formatResult } from "@/features/search/services/currency";
import { Colors, Spacing } from "@/constants/theme";

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
    setFromAmount(converted > 0 ? String(parseFloat(converted.toFixed(8))) : "1");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={ts("exchangeTitle")} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ExchangeHero />
        <ExchangeFormCard
          fromAmount={fromAmount}
          onChangeFromAmount={setFromAmount}
          fromCurrency={fromCurrency}
          onSelectFromCurrency={setFromCurrency}
          toAmount={toAmount}
          toCurrency={toCurrency}
          onSelectToCurrency={setToCurrency}
          rateLabel={rateLabel}
          onSwap={handleSwap}
          onExchange={handleSwap}
        />
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
});
