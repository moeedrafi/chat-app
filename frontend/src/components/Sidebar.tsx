"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const conversations = [
  {
    id: 1,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 5,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 6,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 7,
    username: "John Doe",
    lastMessage: "What are you doing?",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 8,
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

export const Sidebar = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);

  const pathname = usePathname();
  const isConversationOpen = pathname.startsWith("/conversation/");

  return (
    <aside
      className={twMerge(
        "order-1 lg:order-3 min-h-0 flex-1 lg:w-80 lg:flex-none lg:border-r lg:border-color px-3 py-4 flex flex-col gap-4 font-lato",
        isConversationOpen && "hidden lg:flex",
      )}
    >
      <div>LOGO</div>

      <div className="w-full flex flex-col gap-1">
        <input
          onChange={() => {}}
          placeholder="Search for user"
          className="bg-light px-3 py-2 rounded-xl ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2">
        <div
          onClick={() => setActiveFilter("all")}
          className={`bg-light px-4 py-1 border rounded-2xl transition duration-200 ${activeFilter === "all" ? "text-text border-color" : "text-muted-foreground border-gray-700"}`}
        >
          All
        </div>
        <div
          onClick={() => setActiveFilter("unread")}
          className={`bg-light px-4 py-1 border rounded-2xl transition duration-200 ${activeFilter === "unread" ? "text-text border-color" : "text-muted-foreground border-gray-700"}`}
        >
          Unread
        </div>
      </div>

      {/* CONVERSATIONS */}
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
              <span className="text-xs text-muted-foreground">
                {lastMessage}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
