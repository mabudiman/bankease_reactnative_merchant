import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ThemedText } from "@/components/ui/themed-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { useTranslation } from "@/core/i18n";
import type { BillCategory } from "@/features/payTheBill/types";

const ILLUSTRATION = require("@/assets/images/illustrations/pay-success.png");

const BILL_LABEL_KEY: Record<BillCategory, string> = {
  electric: "electricBill",
  water: "waterBill",
  mobile: "mobileBill",
  internet: "internetBill",
};

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tb = (key: string) => t(`billScreen.${key}`);

  const { category = "internet" } = useLocalSearchParams<{ category: BillCategory }>();
  const billLabel = tb(BILL_LABEL_KEY[category]);

  function handleConfirm() {
    router.replace("/(tabs)" as any);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={billLabel} />
      <Image
        source={ILLUSTRATION}
        style={styles.illustration}
        resizeMode="contain"
        accessibilityLabel="Payment successful illustration"
      />

      <ThemedText style={styles.title}>{tb("paymentSuccessTitle")}</ThemedText>

      <ThemedText style={styles.subtitle}>
        {tb("paymentSuccessSubtitle").replace("{{bill}}", billLabel)}
      </ThemedText>

      <PrimaryButton
        title={tb("paymentSuccessButton")}
        onPress={handleConfirm}
        marginTop={Spacing.xxl + 4}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
  },
  illustration: {
    width: "100%",
    height: 200,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: Spacing.lg - 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textBlack,
    textAlign: "center",
    lineHeight: 22,
  },
});
