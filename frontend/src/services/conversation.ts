import { api } from "@/lib/api";
import type { User } from "@/types/user";

export const getUserInformation = async (conversationId: string) => {
  const req = await api.get<User>(`/conversation/${conversationId}/user`);
  return req.data;
};
