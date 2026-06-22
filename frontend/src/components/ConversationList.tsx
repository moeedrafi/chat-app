"use client";
import Image from "next/image";
import { api } from "@/lib/api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const conversations = [
  {
    id: 1,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 9,
    username: "Doe",
    lastMessage: "I'm fine",
    avatar: "https://picsum.photos/300/300",
  },
  {
    id: 10,
    username: "Johnny",
    lastMessage: "What are you?",
    avatar: "https://picsum.photos/300/300",
  },
  {
    id: 11,
    username: "Johnny",
    lastMessage: "What are you?",
    avatar: "https://picsum.photos/300/300",
  },
  {
    id: 12,
    username: "Johnny",
    lastMessage: "What are you?",
    avatar: "https://picsum.photos/300/300",
  },
];

export const ConversationList = () => {
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);

  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const req = await api.get(`/friend`);
      return req.data;
    },
  });

  if (isLoading) return <p>LOADING...</p>;

  return (
    <ul className="flex-1 flex flex-col gap-2 overflow-auto hide-scrollbar">
      {conversations.map(({ id, lastMessage, username, avatar }) => (
        <li
          key={id}
          onClick={() => setActiveConversationId(id)}
          className={`flex items-center gap-3 p-2 rounded-lg border ${activeConversationId === id ? "bg-light border-gradient" : "hover:bg-bg border-transparent"}`}
        >
          <Image
            src={avatar}
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-full"
          />

          <div>
            <h6 className="font-semibold">{username}</h6>
            <span className="text-xs text-muted-foreground">{lastMessage}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
