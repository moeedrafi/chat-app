import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
};
