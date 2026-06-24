import { Messages } from "./Messages";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { ConversationInput } from "./ConversationInput";
import { ConversationHeader } from "./ConversationHeader";

export default async function ConversationIdPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const { data: conversation } = await serverFetch(
    `/conversation/${conversationId}`,
  );

  if (!conversation) {
    notFound();
  }

  return (
    <div className="h-full flex flex-col font-lato text-text space-y-3">
      <ConversationHeader conversationId={conversationId} />
      <Messages conversationId={conversationId} />
      <ConversationInput conversationId={conversationId} />
    </div>
  );
}
