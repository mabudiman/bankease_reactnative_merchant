import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "@/core/i18n";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SearchCategoryCard } from "@/features/search/components/SearchCategoryCard";
import { Colors, Spacing } from "@/constants/theme";
import type { BillCategory } from "@/features/payTheBill/types";

const illustrations = {
  electric: require("@/assets/images/illustrations/pay-bill-electric.png"),
  water: require("@/assets/images/illustrations/pay-bill-water.png"),
  mobile: require("@/assets/images/illustrations/pay-bill-mobile.png"),
  internet: require("@/assets/images/illustrations/pay-bill-internet.png"),
};

export default function PayBillScreen() {
  const { t } = useTranslation();
  const tb = (key: string) => t(`billScreen.${key}`);

  const handleNavigate = (category: BillCategory) => {
    router.push({
      pathname: "/payTheBill/pay-bill-form",
      params: { category },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={tb("title")} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SearchCategoryCard
          title={tb("electricBill")}
          subtitle={tb("electricBillSubtitle")}
          illustration={illustrations.electric}
          onPress={() => handleNavigate("electric")}
        />
        <SearchCategoryCard
          title={tb("waterBill")}
          subtitle={tb("waterBillSubtitle")}
          illustration={illustrations.water}
          onPress={() => handleNavigate("water")}
        />
        <SearchCategoryCard
          title={tb("mobileBill")}
          subtitle={tb("mobileBillSubtitle")}
          illustration={illustrations.mobile}
          onPress={() => handleNavigate("mobile")}
        />
        <SearchCategoryCard
          title={tb("internetBill")}
          subtitle={tb("internetBillSubtitle")}
          illustration={illustrations.internet}
          onPress={() => handleNavigate("internet")}
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
  content: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
