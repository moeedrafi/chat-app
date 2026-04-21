import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const ConversationInput = () => {
  return (
    <div className="bg-bg p-3 border-t border-color">
      <div className="flex items-center gap-2">
        <input
          placeholder="Type a message"
          className="flex-1 text-sm bg-light px-4 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button className="px-2 rounded-full">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
