import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AppLayout } from "./AppLayout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverFetch } from "@/lib/serverFetch";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: user } = await serverFetch("/user");
      return user;
    },
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
