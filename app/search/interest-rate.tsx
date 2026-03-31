import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/core/i18n";
import { ThemedText } from "@/components/ui/themed-text";
import { LoadingState } from "@/components/feedback/loadingState";
import { ErrorState } from "@/components/feedback/errorState";
import { useInterestRates } from "@/features/search/hooks";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { InterestRate } from "@/features/search/types";

export default function InterestRateScreen() {
  const { t } = useTranslation();
  const ts = (key: string) => t(`searchScreen.${key}`);
  const { data, isLoading, isError, refetch } = useInterestRates();

  function renderContent() {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={t("common.error")} onRetry={refetch} recoverable />;
    return (
      <>
        <View style={styles.columnHeader}>
          <ThemedText style={styles.columnKind}>{ts("interestKindColumn")}</ThemedText>
          <ThemedText style={styles.columnDeposit}>{ts("depositColumn")}</ThemedText>
          <ThemedText style={styles.columnRate}>{ts("rateColumn")}</ThemedText>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item: InterestRate) => item.id}
          renderItem={({ item }) => {
            const kindLabel =
              item.kind === "individual"
                ? ts("individualCustomers")
                : ts("corporateCustomers");
            const rateLabel = `${item.rate.toFixed(2)}%`;
            return (
              <View style={styles.row}>
                <ThemedText style={styles.kindText}>{kindLabel}</ThemedText>
                <ThemedText style={styles.depositText}>{item.deposit}</ThemedText>
                <ThemedText style={styles.rateText}>{rateLabel}</ThemedText>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{ts("interestRateTitle")}</ThemedText>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textBlack,
  },
  columnHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  columnKind: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
  },
  columnDeposit: {
    width: 64,
    textAlign: "right",
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
  },
  columnRate: {
    width: 64,
    textAlign: "right",
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  kindText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textBlack,
  },
  depositText: {
    width: 64,
    textAlign: "right",
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textBlack,
  },
  rateText: {
    width: 64,
    textAlign: "right",
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.primary,
  },
});
