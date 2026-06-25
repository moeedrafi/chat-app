"use client";
import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import type { User } from "@/types/user";

export const ConversationHeader = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [status, setStatus] = useState<"Active" | "Inactive">("Inactive");

  const { data, isLoading } = useQuery({
    queryKey: ["user-information", conversationId],
    queryFn: async () => {
      const req = await api.get<User>(`/conversation/${conversationId}/user`);
      return req.data;
    },
  });

  useEffect(() => {
    socket.emit("joinRoom", { conversationId });

    socket.on("status", (status: "Active" | "Inactive") => setStatus(status));

    return () => {
      socket.emit("leaveRoom", { conversationId });
      socket.off("status");
    };
  }, [conversationId]);

  return (
    <div className="bg-bg p-4 flex items-center justify-between gap-2 border-b border-color">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-red-500" />
        <div>
          <h6>{isLoading ? "Loading..." : data?.username}</h6>
          <span
            className={`text-xs ${status === "Active" ? "text-green-500" : "text-red-500"}`}
          >
            {status}
          </span>
        </div>
      </div>

      <button>
        <EllipsisVertical className="w-5 h-5 text-muted-foreground hover:text-text" />
      </button>
    </div>
  );
};
