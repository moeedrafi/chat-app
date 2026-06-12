"use client";
import { Send } from "lucide-react";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export const ConversationInput = () => {
  const [clientId, setClientId] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (!message) return;

    socket.emit("sendMessage", {
      senderId: 1,
      conversationId: "2",
      message,
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
      setClientId(socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  console.log(clientId);

  return (
    <div className="bg-bg p-3 border-t border-color">
      <div className="flex items-center gap-2">
        <input
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 text-sm bg-light px-4 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button onClick={handleSendMessage} className="px-2 rounded-full">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
