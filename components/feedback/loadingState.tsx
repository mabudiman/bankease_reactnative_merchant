import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedText } from "@/components/ui/themed-text";
import { useTranslation } from "@/core/i18n";

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <ThemedView style={styles.center} accessibilityLiveRegion="polite" accessibilityRole="alert" accessible>
      <ThemedView style={styles.section}>
        <ActivityIndicator size="small" />
      </ThemedView>
      <ThemedText>{t("common.loading")}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      marginBottom: 24,
    },
});
