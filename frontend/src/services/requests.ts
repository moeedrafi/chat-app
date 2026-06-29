import { api } from "@/lib/api";
import { PendingRequest } from "@/types/friends";
import type { SearchedUsers } from "@/types/requests";

export const getDebouncedSearch = async (debouncedSearch: string) => {
  const req = await api.get<SearchedUsers[]>(
    `/user/search/${debouncedSearch.trim()}`,
  );
  return req.data;
};

export const getPendingRequests = async () => {
  const req = await api.get<PendingRequest[]>(`/friend-request`);
  return req.data;
};

export const sendFriendRequest = async (userId: number) => {
  return api.post("/friend-request", { userId });
};

export const acceptFriendRequest = async (id: number) => {
  return api.post(`friend-request/${id}`, {});
};

export const rejectFriendRequest = async (id: number) => {
  return api.delete(`friend-request/${id}`);
};
