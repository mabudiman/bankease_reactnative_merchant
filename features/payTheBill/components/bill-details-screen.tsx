import React from "react";
import { View, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedButton } from "@/components/ui/themed-button";
import { Colors, Spacing, Radius, Fonts } from "@/constants/theme";

type BillRow = {
  label: string;
  value: string;
  isTotal?: boolean;
};

const BILL_ROWS: BillRow[] = [
  { label: "Name", value: "Jackson Maine" },
  { label: "Address", value: "Jl. Sudirman No. 12, Jakarta" },
  { label: "Customer ID", value: "1234-5678-90" },
  { label: "Internet Type", value: "Fiber Optic 100 Mbps" },
  { label: "From", value: "01/10/2019" },
  { label: "To", value: "01/11/2019" },
  { label: "Fee", value: "Rp 350.000" },
  { label: "Tax (11%)", value: "Rp 38.500" },
  { label: "Total", value: "Rp 388.500", isTotal: true },
];

export function BillDetailsScreen() {
  const router = useRouter();

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
          Internet Bill
        </ThemedText>

        <View style={styles.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Illustration ── */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/images/bill_illustration.png")}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Bill illustration"
          />
        </View>

        <ThemedText style={styles.dateTitle}>
          {BILL_ROWS.find((row) => row.label === "From")?.value} -{" "}
          {BILL_ROWS.find((row) => row.label === "To")?.value}
        </ThemedText>
        {/* ── Bill Details Card ── */}
        <View style={styles.card}>
          {/* Section label */}
          <ThemedText style={styles.sectionLabel}>All the bills</ThemedText>

          {/* Bill rows */}
          {BILL_ROWS.map((row, index) => {
            const last = index >= BILL_ROWS.length - 3;
            const isLast = index === BILL_ROWS.length - 1;
            return (
              <View key={row.label}>
                <View
                  style={[styles.billRow, row.isTotal && styles.billRowTotal]}
                >
                  <ThemedText
                    style={[
                      styles.billLabel,
                      last && styles.billLabelLast,
                      row.isTotal && styles.billLabelTotal,
                    ]}
                  >
                    {row.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.billValue,
                      last && styles.billValueLast,
                      row.isTotal && styles.billValueTotal,
                    ]}
                  >
                    {row.value}
                  </ThemedText>
                </View>

                {/* Row separator — skip last row (Total has divider above instead) */}
                {!isLast && !row.isTotal && (
                  <View style={styles.rowSeparator} />
                )}

                {last && !row.isTotal && (
                  <View style={styles.dottedDivider}>
                    {Array.from({ length: 50 }).map((_, i) => (
                      <View key={i} style={styles.dottedDividerDot} />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── Pay Button ── */}
        <ThemedButton
          title="Pay the Bill"
          variant="primary"
          onPress={() => router.back()}
          style={styles.payButton}
          lightColor={Colors.primary}
          darkColor={Colors.primary}
          lightTextColor={Colors.white}
          darkTextColor={Colors.white}
          accessibilityLabel="Pay the Bill"
        />
      </ScrollView>
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
  },

  dateTitle: {
    fontSize: 14,
    color: Colors.signUpText,
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.lg,
  },

  // ── Section label ──
  sectionLabel: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },

  // ── Dividers ──
  dottedDivider: {
    flexDirection: "row",
    overflow: "hidden",
    gap: 5,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  dottedDividerDot: {
    width: 12,
    height: 1,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: "#F3F4F8",
    marginVertical: Spacing.xs,
  },

  // ── Bill Rows ──
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Spacing.xs + 2,
  },
  billRowTotal: {
    paddingVertical: Spacing.sm,
  },
  billLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.signUpText,
    flex: 1,
    marginRight: Spacing.sm,
  },
  billLabelLast: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  billLabelTotal: {
    color: Colors.textDark,
  },
  billValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textDark,
    textAlign: "right",
  },
  billValueLast: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  billValueTotal: {
    color: Colors.light.activityNegative,
  },

  // ── Pay Button ──
  payButton: {
    borderRadius: Radius.md,
    width: "100%",
  },
});
