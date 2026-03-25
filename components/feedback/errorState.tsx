import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { StyleSheet } from "react-native";
import { useTranslation } from "@/core/i18n";
import { memo } from "react";
type Props = {
  message: string;
  onRetry?: () => void;
  recoverable?: boolean;
};

const ErrorStateComponent = ({ message, onRetry, recoverable }: Props) => {
  const { t } = useTranslation();
  return (
    <ThemedView
      style={styles.center}
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      accessible
    >
      <ThemedView style={styles.section}>
        <ThemedText>{message}</ThemedText>
      </ThemedView>
      {recoverable && (
        <ThemedButton
          title={t("common.retry")}
          style={{ width: 200 }}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={t("common.retryLabel")}
          accessibilityHint={t("common.retryHint")}
          accessibilityLiveRegion="polite"
        />
      )}
    </ThemedView>
  );
};
export const ErrorState = memo(ErrorStateComponent);
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 24,
  },
});
