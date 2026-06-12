"use client";
import { socket } from "@/lib/socket";
import { formatSeenAt } from "@/lib/utils";
import { useEffect, useState } from "react";

const messages = [
  {
    id: 1,
    sender: "john_doe",
    message:
      "What is this? no way is this it? sending a long message like this is crazy?",
    seen_at: "2026-02-21T10:15:00Z",
  },
  {
    id: 2,
    sender: "jane_smith",
    message: "Hey John, can you check this out?",
    seen_at: "2026-04-21T10:17:30Z",
  },
  {
    id: 3,
    sender: "jane_smith",
    message: "Sure, give me a minute.",
    seen_at: "2026-05-21T10:18:05Z",
  },
  {
    id: 4,
    sender: "jane_smith",
    message: "Sure, give me a minute.",
    seen_at: "2026-05-21T10:18:05Z",
  },
  {
    id: 5,
    sender: "john_doe",
    message: "Meeting starts in 10 minutes.",
    seen_at: "2026-04-21T10:20:45Z",
  },
  {
    id: 6,
    sender: "john_doe",
    message: "Got it, joining now.",
    seen_at: "2026-04-21T10:22:10Z",
  },
  {
    id: 7,
    sender: "john_doe",
    message: "Got it now.",
    seen_at: "2026-04-21T10:22:10Z",
  },
  {
    id: 8,
    sender: "john_doe",
    message: "Got it now.",
    seen_at: "2026-04-21T10:22:10Z",
  },
];

export const Messages = () => {
  const [message, setMessage] = useState<{ message: string; id: string }[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.emit("joinRoom", { roomId: "2" });

    socket.on("receiveMessage", (newMessages) => {
      console.log(newMessages);
      setMessage((prev) => [...prev, newMessages]);
    });

    return () => {
      socket.emit("leaveRoom", { roomId: "2" }); // leave on unmount
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col gap-3 px-3 max-w-7xl mx-auto overflow-auto hide-scrollbar">
      {message.map((m) => (
        <p key={m.id}>{m.message}</p>
      ))}

      {messages.map((message) => {
        const isOwn = message.sender === "john_doe";

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
