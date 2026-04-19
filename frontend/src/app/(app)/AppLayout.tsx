"use client";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isChatsPage = pathname === "/";

  return (
    <main
      className={twMerge(
        "flex-1 min-w-0 lg:order-3",
        isChatsPage && "hidden lg:block",
      )}
    >
      {children}
    </main>
  );
};
