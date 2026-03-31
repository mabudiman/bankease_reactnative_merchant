import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/core/i18n";
import { ThemedText } from "@/components/ui/themed-text";
import { LoadingState } from "@/components/feedback/loadingState";
import { ErrorState } from "@/components/feedback/errorState";
import { EmptyState } from "@/components/feedback/emptyState";
import { MessageItem } from "@/features/messages/components";
import { useMessages } from "@/features/messages/hooks";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { Message } from "@/features/messages/types";

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMessages();
  const todayLabel = t("messages.today");

  function renderContent() {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={t("common.error")} onRetry={refetch} recoverable />;
    if (!data || data.length === 0)
      return (
        <EmptyState
          title={t("messages.empty")}
          description={t("common.nothingHereDescription")}
        />
      );
    return (
      <FlatList
        data={data}
        keyExtractor={(item: Message) => item.id}
        renderItem={({ item }) => (
          <MessageItem
            item={item}
            todayLabel={todayLabel}
            onPress={() => router.push(`/messages/${item.id}` as any)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.navigate("/(tabs)" as any)}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back to Home"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{t("messages.title")}</ThemedText>
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
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textBlack,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
