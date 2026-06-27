"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSendMessage } from "@/hooks/useSendMessage";

export const ConversationInput = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [message, setMessage] = useState<string>("");

  const sendMessageMutation = useSendMessage(conversationId);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
    setMessage("");
  };

  return (
    <div className="bg-bg p-3 border-t border-color">
      <div className="flex items-center gap-2">
        <input
          value={message}
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
