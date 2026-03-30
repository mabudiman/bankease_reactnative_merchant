import { Image, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "@/core/i18n";
import { Card } from "@/components/ui/card";
import { InputWithSelector } from "@/components/ui/input-with-selector";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ThemedText } from "@/components/ui/themed-text";
import { CURRENCIES, CURRENCY_LIST } from "@/features/search/services/currency";
import { Colors, Fonts, Spacing } from "@/constants/theme";

const SWAP = require("@/assets/images/icons/swap-icon.png");

type Props = {
  fromAmount: string;
  onChangeFromAmount: (value: string) => void;
  fromCurrency: string;
  onSelectFromCurrency: (currency: string) => void;
  toAmount: string;
  toCurrency: string;
  onSelectToCurrency: (currency: string) => void;
  rateLabel: string;
  onSwap: () => void;
  onExchange: () => void;
};

const OPTION_LABELS = CURRENCY_LIST.map((c) => c.label);

export function ExchangeFormCard({
  fromAmount,
  onChangeFromAmount,
  fromCurrency,
  onSelectFromCurrency,
  toAmount,
  toCurrency,
  onSelectToCurrency,
  rateLabel,
  onSwap,
  onExchange,
}: Props) {
  const { t } = useTranslation();
  const ts = (key: string) => t(`searchScreen.${key}`);

  return (
    <Card>
      <InputWithSelector
        label={ts("from")}
        value={fromAmount}
        onChangeText={onChangeFromAmount}
        selectedOption={fromCurrency}
        options={CURRENCIES}
        optionLabels={OPTION_LABELS}
        onSelectOption={onSelectFromCurrency}
        modalTitle={ts("selectCurrency")}
      />

      <View style={styles.swapCenter}>
        <Pressable
          onPress={onSwap}
          accessibilityRole="button"
          accessibilityLabel="Swap currencies"
        >
          <Image source={SWAP} style={styles.swapButton} resizeMode="contain" />
        </Pressable>
      </View>

      <InputWithSelector
        label={ts("to")}
        value={toAmount}
        selectedOption={toCurrency}
        options={CURRENCIES}
        optionLabels={OPTION_LABELS}
        onSelectOption={onSelectToCurrency}
        modalTitle={ts("selectCurrency")}
      />

      <View style={styles.rateRow}>
        <ThemedText style={styles.rateRowLabel}>{ts("currencyRate")}</ThemedText>
        <ThemedText style={styles.rateRowValue}>{rateLabel}</ThemedText>
      </View>

      <PrimaryButton title={ts("exchangeButton")} onPress={onExchange} marginBottom={0} />
    </Card>
  );
}

const styles = StyleSheet.create({
  swapCenter: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  swapButton: {
    width: 46,
    height: 24,
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
});
