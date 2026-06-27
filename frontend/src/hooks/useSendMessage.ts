import { useUser } from "./useUser";
import { socket } from "@/lib/socket";
import { MessageStatus, type Message } from "@/types/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSendMessage = (conversationId: string) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const queryKey = ["messages", conversationId];

  return useMutation({
    mutationFn: async (message: string) => {
      return await socket.emitWithAck("sendMessage", {
        senderId: user!.id,
        conversationId,
        message,
      });
    },
    onMutate: async (message: string) => {
      const tempId = crypto.randomUUID();
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

      const newMessage: Message = {
        id: tempId,
        message,
        seen_at: null,
        createdAt: new Date().toISOString(),
        status: MessageStatus.SENT,
        sender: { email: user!.email, username: user!.username, id: user!.id },
      };

      queryClient.setQueryData<Message[]>(queryKey, (old = []) => [
        ...old,
        newMessage,
      ]);

      return { previousMessages, tempId };
    },
    onSuccess: (serverMessage, _vars, context) => {
      queryClient.setQueryData<Message[]>(queryKey, (oldMessages = []) =>
        oldMessages.map((m) => (m.id === context.tempId ? serverMessage : m)),
      );
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previousMessages);
    },
  });
};
