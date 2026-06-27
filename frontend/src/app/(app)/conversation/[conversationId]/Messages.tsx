"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Loader, MessageCircleMore } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useUser } from "@/hooks/useUser";
import { formatSeenAt } from "@/lib/utils";
import type { Message } from "@/types/message";

export const Messages = ({ conversationId }: { conversationId: string }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const req = await api.get<Message[]>(`/message/${conversationId}`);
      return req.data;
    },
  });

  useEffect(() => {
    const handler = (newMessage: Message) => {
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old = []) => {
          if (old.some((m) => m.id === newMessage.id)) return old;
          return [...old, newMessage];
        },
      );
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [conversationId, queryClient]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  if (isLoading) {
    return (
      <div className="w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-1 text-muted-foreground">
        <Loader className="animate-spin" />
        <p>Skeleton Loader</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
        <MessageCircleMore />
        <p>No messages sent yet</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 flex flex-col gap-3 px-3 max-w-7xl mx-auto overflow-auto hide-scrollbar font-lato"
    >
      {messages.map((message) => {
        const isOwn = message.sender.id === user?.id;

        return (
          <div
            key={message.id}
            className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex flex-col max-w-xs px-4 py-3 rounded-lg gap-1 ${isOwn ? "bg-secondary items-end" : "bg-light items-start"}`}
            >
              <p className="text-text">{message.message}</p>

              {message.seen_at ? (
                <span className="text-muted-foreground text-xs">
                  {formatSeenAt(message.seen_at)}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
