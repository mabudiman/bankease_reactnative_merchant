import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/core/i18n";
import { ThemedText } from "@/components/ui/themed-text";
import { LoadingState } from "@/components/feedback/loadingState";
import { ErrorState } from "@/components/feedback/errorState";
import { MessageBubble, DateSeparator } from "@/features/messages/components";
import { useMessageThread } from "@/features/messages/hooks";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import type { ThreadMessage } from "@/features/messages/types";

type ListItem =
  | { kind: "separator"; id: string; label: string }
  | { kind: "bubble"; message: ThreadMessage };

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: thread, isLoading, isError, refetch } = useMessageThread(id);

  const [localMessages, setLocalMessages] = useState<ThreadMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const allMessages = useMemo(() => {
    if (!thread) return localMessages;
    return [...thread.messages, ...localMessages];
  }, [thread, localMessages]);

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    let lastDateLabel = "";

    for (const msg of allMessages) {
      const date = new Date(msg.date);
      const dateLabel = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      if (dateLabel !== lastDateLabel) {
        items.push({ kind: "separator", id: `sep-${dateLabel}`, label: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` });
        lastDateLabel = dateLabel;
      }
      items.push({ kind: "bubble", message: msg });
    }
    return items;
  }, [allMessages]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    const newMsg: ThreadMessage = {
      id: `local-${Date.now()}`,
      text,
      type: "sent",
      date: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setInputText("");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textBlack} />
        </Pressable>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {thread?.title ?? ""}
        </ThemedText>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={t("common.error")} onRetry={refetch} recoverable />
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <FlatList
            data={listItems}
            keyExtractor={(item) =>
              item.kind === "separator" ? item.id : item.message.id
            }
            renderItem={({ item }) =>
              item.kind === "separator" ? (
                <DateSeparator label={item.label} />
              ) : (
                <MessageBubble message={item.message} />
              )
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t("messages.inputPlaceholder")}
              placeholderTextColor="#AAAAAA"
              onSubmitEditing={handleSend}
              returnKeyType="send"
              accessibilityLabel={t("messages.inputPlaceholder")}
            />
            <Pressable
              onPress={handleSend}
              style={[
                styles.sendButton,
                inputText.trim().length > 0
                  ? styles.sendButtonActive
                  : styles.sendButtonInactive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={t("messages.send")}
            >
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textBlack,
    flex: 1,
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: "#CCCCCC",
  },
});
