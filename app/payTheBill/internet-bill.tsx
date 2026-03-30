import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ThemedText } from "@/components/ui/themed-text";
import { Card } from "@/components/ui/card";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { INTERNET_BILL_DETAIL } from "@/mocks/data";

const HERO = require("@/assets/images/illustrations/pay-the-bill-illustration.png");

export default function InternetBillScreen() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`billScreen.${key}`);

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
      <ScreenHeader title={tb("internetBillTitle")} />

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
});
