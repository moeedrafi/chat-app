"use client";
import { UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Modal } from "./Modal";
import { socket } from "@/lib/socket";
import { queryKeys } from "@/lib/query-key";
import { getUserInformation } from "@/services/conversation";

export const ConversationHeader = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.userInformation(conversationId),
    queryFn: () => getUserInformation(conversationId),
  });

  useEffect(() => {
    if (!data?.id) return;

    socket.emitWithAck("getOnlineStatus", data.id).then((isOnline: boolean) => {
      setIsOnline(isOnline);
    });

    const handleOnline = ({ userId }: { userId: number }) => {
      if (userId === data.id) setIsOnline(true);
    };

    const handleOffline = ({ userId }: { userId: number }) => {
      if (userId === data.id) setIsOnline(false);
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [data?.id]);

  return (
    <>
      <div className="bg-bg p-4 flex items-center justify-between gap-2 border-b border-color">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-red-500" />
          <div>
            <h6>{isLoading ? "Loading..." : data?.username}</h6>
            <span
              className={`text-xs ${isOnline ? "text-green-500" : "text-red-500"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <UserMinus className="w-5 h-5" />
          Unfriend
        </button>
      </div>

      {isOpen && (
        <Modal username={data!.username} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};
