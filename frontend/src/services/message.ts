import { api } from "@/lib/api";
import type { Message } from "@/types/message";

export const getMessages = async (conversationId: string) => {
  const req = await api.get<Message[]>(`/message/${conversationId}`);
  return req.data;
};
