import { useQuery } from "@tanstack/react-query";
import { getMessages, getMessageThread } from "../api";
import type { Message, MessageThread } from "../types";

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: getMessages,
  });
}

export function useMessageThread(id: string) {
  return useQuery<MessageThread>({
    queryKey: ["message-thread", id],
    queryFn: () => getMessageThread(id),
    enabled: !!id,
  });
}
