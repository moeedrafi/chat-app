import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AppLayout } from "./AppLayout";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-svh flex flex-col lg:flex-row overflow-hidden">
      <Navbar />
      <Sidebar />
      <AppLayout>{children}</AppLayout>
    </div>
  );
}
