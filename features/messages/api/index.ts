import { request } from "@/core/api/client";
import type { Message, MessageThread } from "../types";

export async function getMessages(): Promise<Message[]> {
  return request<Message[]>("/api/messages");
}

export async function getMessageThread(id: string): Promise<MessageThread> {
  return request<MessageThread>(`/api/messages/${id}`);
}
