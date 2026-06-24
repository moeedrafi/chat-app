"use client";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { formatSeenAt } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Message } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";

export const Messages = ({ conversationId }: { conversationId: string }) => {
  const [message, setMessage] = useState<{ message: string; id: string }[]>([]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const req = await api.get<Message[]>(`/message/${conversationId}`);
      return req.data;
    },
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.emit("joinRoom", { roomId: conversationId });

    socket.on("receiveMessage", (newMessages) => {
      console.log(newMessages);
      setMessage((prev) => [...prev, newMessages]);
    });

    return () => {
      socket.emit("leaveRoom", { roomId: conversationId }); // leave on unmount
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  if (isLoading) {
    return <p>LOADING...</p>;
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
    <div className="w-full flex-1 flex flex-col gap-3 px-3 max-w-7xl mx-auto overflow-auto hide-scrollbar">
      {message.map((m) => (
        <p key={m.id}>{m.message}</p>
      ))}

      {messages.map((message) => {
        const isOwn = message.sender.username === "john_doe";

        return (
          <div
            key={message.id}
            className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex flex-col max-w-xs px-4 py-3 rounded-lg gap-1 ${isOwn ? "bg-secondary items-end" : "bg-light items-start"}`}
            >
              <p className="text-text">{message.message}</p>
              <span className="text-muted-foreground text-xs">
                {formatSeenAt(message.seen_at)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
