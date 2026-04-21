import { Messages } from "./Messages";
import { ConversationInput } from "./ConversationInput";
import { ConversationHeader } from "./ConversationHeader";

export default function ConversationIdPage() {
  return (
    <div className="h-full flex flex-col font-lato text-text space-y-3">
      <ConversationHeader />
      <Messages />
      <ConversationInput />
    </div>
  );
}
