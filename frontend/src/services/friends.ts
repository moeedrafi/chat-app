import { api } from "@/lib/api";
import type { FriendList } from "@/types/friends";

export const getFriends = async () => {
  const req = await api.get<FriendList[]>(`/friend`);
  return req.data;
};
