import { ThemedText } from "@/components/ui/themed-text"
import { ThemedView } from "@/components/ui/themed-view"
import { StyleSheet } from "react-native"
import { useTranslation } from "@/core/i18n"

type Props = {
  title?: string
  description?: string
}

export function EmptyState({
  title,
  description,
}: Props) {
  const { t } = useTranslation();
  const displayTitle = title ?? t("common.nothingHere");
  const displayDescription = description ?? t("common.nothingHereDescription");
  return (
    <ThemedView style={styles.container}
        accessibilityRole="text"
        accessibilityLabel={t("common.noDataAvailable")}
        accessibilityLiveRegion="polite"
    >
      <ThemedText type="subtitle">
        {displayTitle}
      </ThemedText>

      <ThemedText
        style={{ textAlign: "center", marginTop: 8 }}
      >
        {displayDescription}
      </ThemedText>
    </ThemedView>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      },
});
