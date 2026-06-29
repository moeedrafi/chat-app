import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { serverFetch } from "@/lib/serverFetch";

export const getMe = async () => {
  const res = await api.get<User>("/user");
  return res.data;
};

export const getMeSSR = async () => {
  const { data: user } = await serverFetch("/user");
  return user;
};
