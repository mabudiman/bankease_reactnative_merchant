import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemedButton } from "@/components/ui/themed-button";
import { router } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "@/core/i18n";

export default function ModalScreen() {
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Modal
        </ThemedText>
        <ThemedButton
          title={t("common.close")}
          onPress={handleClose}
          variant="outline"
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    marginBottom: 16,
  },
});
