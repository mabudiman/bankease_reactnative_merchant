import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ThemedText } from "@/components/ui/themed-text";
import { Card } from "@/components/ui/card";
import { SelectorInput } from "@/components/ui/selector-input";
import { LabeledInput } from "@/components/ui/labeled-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { router } from "expo-router";
import { useProviders } from "@/features/payTheBill/hooks";
import type { BillCategory } from "@/features/payTheBill/types";
import { Colors, Fonts, Spacing } from "@/constants/theme";

const TITLE_KEY: Record<BillCategory, string> = {
  electric: "payElectricBill",
  water: "payWaterBill",
  mobile: "payMobileBill",
  internet: "payInternetBill",
};

const LABEL_KEY: Record<BillCategory, string> = {
  electric: "typeElectricBillCode",
  water: "typeWaterBillCode",
  mobile: "typeMobileBillCode",
  internet: "typeInternetBillCode",
};

export default function PayBillFormScreen() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`billScreen.${key}`);

  const { category = "internet" } = useLocalSearchParams<{ category: BillCategory }>();
  const billCategory = category as BillCategory;

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [billCode, setBillCode] = useState("");

  const { data: providers = [] } = useProviders(billCategory);
  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  const handleCheck = () => {
    router.push({
      pathname: "/payTheBill/bill-detail",
      params: { category: billCategory },
    } as any);
  };

  const handleBillCodeChange = (text: string) => {
    setBillCode(text);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={tb(TITLE_KEY[billCategory])} />

      <Card style={styles.card}>
        <SelectorInput
          selectedOption={selectedProviderId}
          placeholder={tb("chooseCompany")}
          options={providers.map((p) => p.id)}
          optionLabels={providers.map((p) => p.name)}
          onSelectOption={handleProviderSelect}
          modalTitle={tb("selectProvider")}
        />
        <LabeledInput
          label={tb(LABEL_KEY[billCategory])}
          value={billCode}
          onChangeText={handleBillCodeChange}
          placeholder={tb("billCodePlaceholder")}
        />

        <ThemedText style={styles.helperText}>{tb("billCodeHelper")}</ThemedText>

        <PrimaryButton
          title={tb("checkButton")}
          onPress={handleCheck}
          disabled={billCode.trim().length === 0}
          marginTop={Spacing.lg}
          marginBottom={0}
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  helperText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.labelText,
    marginTop: Spacing.lg - 2,
  },
});
