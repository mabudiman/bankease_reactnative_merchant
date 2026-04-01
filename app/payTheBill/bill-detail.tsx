import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ThemedText } from "@/components/ui/themed-text";
import { Card } from "@/components/ui/card";
import { LabeledInput } from "@/components/ui/labeled-input";
import { SelectorInput } from "@/components/ui/selector-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { INTERNET_BILL_DETAIL, MOCK_PAYMENT_CARDS } from "@/mocks/data";
import type { BillCategory } from "@/features/payTheBill/types";

const HERO = require("@/assets/images/illustrations/pay-the-bill-illustration.png");
const TITLE_KEY: Record<BillCategory, string> = {
  electric: "electricBill",
  water: "waterBill",
  mobile: "mobileBill",
  internet: "internetBill",
};

export default function BillDetailScreen() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`billScreen.${key}`);

  const { category = "internet" } = useLocalSearchParams<{ category: BillCategory }>();
  const billCategory = category;

  const [selectedCardId, setSelectedCardId] = useState(MOCK_PAYMENT_CARDS[0].id);
  const [otp, setOtp] = useState("");

  const bill = INTERNET_BILL_DETAIL;

  const rows: { label: string; value: string; isTotal?: boolean }[] = [
    { label: tb("rowName"), value: bill.name },
    { label: tb("rowAddress"), value: bill.address },
    { label: tb("rowPhone"), value: bill.phoneNumber },
    { label: tb("rowCode"), value: bill.code },
    { label: tb("rowFrom"), value: bill.from },
    { label: tb("rowTo"), value: bill.to },
    { label: tb("rowInternetFee"), value: bill.internetFee },
    { label: tb("rowTax"), value: bill.tax },
    { label: tb("rowTotal"), value: bill.total, isTotal: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={tb(TITLE_KEY[billCategory])} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={HERO} style={styles.hero} resizeMode="contain" />
        <ThemedText style={styles.dateLabel}>
          {rows.find((row) => row.label === tb("rowFrom"))?.value} -{" "}
          {rows.find((row) => row.label === tb("rowTo"))?.value}
        </ThemedText>
        <Card style={{ borderRadius: Spacing.md - 1 }}>
          <ThemedText style={styles.sectionLabel}>{tb("allBills")}</ThemedText>
          {rows.map(({ label, value, isTotal }, index) => (
            <View
              key={label}
              style={[
                styles.row,
                index >= rows.length - 3 && index < rows.length - 1 && styles.rowBorder,
                isTotal && styles.rowTotal,
              ]}
            >
              <ThemedText
                style={[
                  styles.rowLabel,
                  index >= rows.length - 3 && index < rows.length - 1 && styles.lastLabel,
                  isTotal && styles.totalLabel,
                ]}
              >
                {label}
              </ThemedText>
              <ThemedText
                style={[
                  styles.rowValue,
                  index >= rows.length - 3 && index < rows.length - 1 && styles.lastValue,
                  isTotal && styles.totalValue,
                ]}
              >
                {value}
              </ThemedText>
            </View>
          ))}
        </Card>

        {/* Choose Account */}
        <SelectorInput
          style={{ marginVertical: Spacing.lg }}
          selectedOption={selectedCardId}
          placeholder={tb("chooseAccount")}
          options={MOCK_PAYMENT_CARDS.map((c) => c.id)}
          optionLabels={MOCK_PAYMENT_CARDS.map(
            (c) => `${c.cardLabel} • ${c.maskedNumber.slice(-4)}`,
          )}
          onSelectOption={setSelectedCardId}
          modalTitle={tb("chooseAccount")}
        />
        {/* OTP */}
        <View style={styles.otpRow}>
          <View style={styles.otpInputWrapper}>
            <LabeledInput
              label={tb("otpCode")}
              value={otp}
              onChangeText={setOtp}
              placeholder="OTP"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
          <ThemedButton
            title={tb("getOTP")}
            variant="primary"
            lightColor={Colors.primary}
            darkColor={Colors.primary}
            onPress={() => {}}
            style={styles.otpButton}
          />
        </View>

        <PrimaryButton
          title={tb("payBillButton")}
          onPress={() => {
            router.push({
              pathname: "/payTheBill/payment-success",
              params: { category: billCategory },
            } as any);
          }}
          disabled={otp.trim().length < 6}
          marginTop={Spacing.xxl}
          marginBottom={Spacing.sm}
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
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  hero: {
    width: "100%",
    marginBottom: 0,
  },
  dateLabel: {
    textAlign: "center",
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.grey,
    marginBottom: Spacing.lg - 1,
  },
  sectionLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textBlack,
    marginBottom: Spacing.lg - 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md - 1,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.dividerDashed,
    borderStyle: "dashed",
    paddingBottom: Spacing.md - 5,
  },
  rowTotal: {
    marginTop: Spacing.xs + 1,
    marginBottom: 0,
  },
  rowLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.labelText,
  },
  rowValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textBlack,
    textAlign: "right",
  },
  lastLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textDark,
  },
  totalValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 23,
    color: Colors.totalText,
  },
  lastValue: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.primary,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textBlack,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  accountCard: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
  },
  otpCard: {
    marginTop: Spacing.md,
    padding: Spacing.lg,
  },
  otpRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  otpInputWrapper: {
    flex: 1,
  },
  otpButton: {
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: 2,
  },
});
