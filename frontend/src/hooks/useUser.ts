import { api } from "@/lib/api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const {
    data: user,
    isPending,
    isError,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get<User>("/user");
      return res.data;
    },
    staleTime: Infinity,
    retry: false,
  });

  return { user, isPending, isError };
};
