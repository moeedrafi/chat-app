import { AppLayout } from "./AppLayout";
import { getMeSSR } from "@/services/user";
import { queryKeys } from "@/lib/query-key";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.me(),
    queryFn: getMeSSR,
  });

  return (
    <div className="h-svh flex flex-col lg:flex-row overflow-hidden">
      <Navbar />
      <Sidebar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AppLayout>{children}</AppLayout>
      </HydrationBoundary>
    </div>
  );
}
