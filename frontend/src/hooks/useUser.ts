import { queryKeys } from "@/lib/query-key";
import { getMe } from "@/services/user";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const {
    data: user,
    isPending,
    isError,
  } = useQuery<User>({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    staleTime: Infinity,
    retry: false,
  });

  return { user, isPending, isError };
};
