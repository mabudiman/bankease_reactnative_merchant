import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "@/core/i18n";
import { ThemedText } from "@/components/ui/themed-text";
import { SearchCategoryCard } from "@/features/search/components/SearchCategoryCard";
import { Colors, Fonts, Spacing } from "@/constants/theme";

const illustrations = {
  branch: require("@/assets/images/illustrations/search-branch.png"),
  interestRate: require("@/assets/images/illustrations/search-interest-rate.png"),
  exchangeRate: require("@/assets/images/illustrations/search-exchange-rate.png"),
  exchange: require("@/assets/images/illustrations/search-exchange.png"),
};

const CATEGORY_BG = {
  branch: "#EEF2FF",
  interestRate: "#FFF8E7",
  exchangeRate: "#E8F5E9",
  exchange: "#FFF0F0",
} as const;

export default function SearchScreen() {
  const { t } = useTranslation();
  const ts = (key: string) => t(`searchScreen.${key}`);

  const handleComingSoon = () => {
    Alert.alert(ts("comingSoon"), ts("comingSoonMessage"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>{t("common.search")}</ThemedText>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SearchCategoryCard
          title={ts("branch")}
          subtitle={ts("branchSubtitle")}
          illustration={illustrations.branch}
          bgColor={CATEGORY_BG.branch}
          onPress={() => router.push("/search/branch" as any)}
        />
        <SearchCategoryCard
          title={ts("interestRate")}
          subtitle={ts("interestRateSubtitle")}
          illustration={illustrations.interestRate}
          bgColor={CATEGORY_BG.interestRate}
          onPress={() => router.push("/search/interest-rate" as any)}
        />
        <SearchCategoryCard
          title={ts("exchangeRate")}
          subtitle={ts("exchangeRateSubtitle")}
          illustration={illustrations.exchangeRate}
          bgColor={CATEGORY_BG.exchangeRate}
          onPress={() => router.push("/search/exchange-rate" as any)}
        />
        <SearchCategoryCard
          title={ts("exchange")}
          subtitle={ts("exchangeSubtitle")}
          illustration={illustrations.exchange}
          bgColor={CATEGORY_BG.exchange}
          onPress={handleComingSoon}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.textBlack,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
