import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/core/i18n";
import { ThemedText } from "@/components/ui/themed-text";
import { LoadingState } from "@/components/feedback/loadingState";
import { ErrorState } from "@/components/feedback/errorState";
import { ExchangeRateRow } from "@/features/search/components/ExchangeRateRow";
import { useExchangeRates } from "@/features/search/hooks";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { ExchangeRate } from "@/features/search/types";

export default function ExchangeRateScreen() {
  const { t } = useTranslation();
  const ts = (key: string) => t(`searchScreen.${key}`);
  const { data, isLoading, isError, refetch } = useExchangeRates();

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
        <ThemedText style={styles.headerTitle}>{ts("exchangeRateTitle")}</ThemedText>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={t("common.error")} onRetry={refetch} recoverable />
      ) : (
        <>
          <View style={styles.columnHeader}>
            <View style={styles.flagPlaceholder} />
            <ThemedText style={styles.columnCountry}>{ts("countryColumn")}</ThemedText>
            <ThemedText style={styles.columnValue}>{ts("buyColumn")}</ThemedText>
            <ThemedText style={styles.columnValue}>{ts("sellColumn")}</ThemedText>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item: ExchangeRate) => item.id}
            renderItem={({ item }) => <ExchangeRateRow item={item} />}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
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
  flagPlaceholder: {
    width: Spacing.sm,
  },
  columnCountry: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
  },
  columnValue: {
    width: 60,
    textAlign: "right",
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textMuted,
  },
});
