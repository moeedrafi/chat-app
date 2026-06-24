"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { FriendList } from "@/types/friends";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";

export const ConversationList = () => {
  const pathname = usePathname();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const req = await api.get<FriendList[]>(`/friend`);
      return req.data;
    },
  });

  if (isLoading) return <p>LOADING...</p>;

  if (friends?.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
        <MessageCircleMore />
        <p>Add friends to chat</p>
      </div>
    );
  }

  return (
    <ul className="flex-1 flex flex-col gap-2 overflow-auto hide-scrollbar">
      {friends.map(({ id, username, conversationId }) => {
        const isActive = pathname === `/conversation/${conversationId}`;

        return (
          <Link
            key={id}
            href={`/conversation/${conversationId}`}
            className={`flex items-center gap-3 p-2 rounded-lg border ${isActive ? "bg-light border-gradient" : "border-transparent hover:bg-bg hover:border-color"}`}
          >
            <div className="w-12 h-12 rounded-full bg-red-500 shrink-0" />

            <div>
              <h6 className="font-semibold">{username}</h6>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
