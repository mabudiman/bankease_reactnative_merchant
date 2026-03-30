import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ThemedText } from "@/components/ui/themed-text";
import { Card } from "@/components/ui/card";
import { SelectorInput } from "@/components/ui/selector-input";
import { LabeledInput } from "@/components/ui/labeled-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { router } from "expo-router";
import { useProviders } from "@/features/payTheBill/hooks";
import { Colors, Fonts, Spacing } from "@/constants/theme";

export default function PayBillScreen() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`billScreen.${key}`);

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [billCode, setBillCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: providers = [] } = useProviders();
  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  const handleCheck = () => {
    setSubmitted(true);
    router.push("/payTheBill/internet-bill" as any);
  };

  const handleBillCodeChange = (text: string) => {
    setBillCode(text);
    setSubmitted(false);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
    setSubmitted(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={tb("title")} />

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
          label={tb("typeBillCode")}
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
  fieldLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.labelText,
  },
  helperText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.labelText,
    marginTop: Spacing.lg - 2,
  },
});
