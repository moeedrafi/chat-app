import { Messages } from "./Messages";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { ConversationInput } from "./ConversationInput";
import { ConversationHeader } from "./ConversationHeader";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-information", conversationId],
    queryFn: async () => {
      const { data } = await serverFetch(
        `/conversation/${conversationId}/user`,
      );
      return data;
    },
  });

  return (
    <div className="h-screen flex flex-col font-lato text-text space-y-3">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConversationHeader conversationId={conversationId} />
      </HydrationBoundary>

      <Messages conversationId={conversationId} />

      <ConversationInput conversationId={conversationId} />
    </div>
  );
}
