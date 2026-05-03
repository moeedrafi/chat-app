"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { ConversationList } from "./ConversationList";

export const Sidebar = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const pathname = usePathname();
  const showSidebar = pathname === "/";

  return (
    <aside
      className={twMerge(
        "order-1 lg:order-3 min-h-0 flex-1 lg:w-80 lg:flex-none lg:border-r lg:border-color px-3 py-4 flex flex-col gap-4 font-lato",
        !showSidebar && "hidden lg:flex", // hide on mobile for non-chat pages
      )}
    >
      <div>LOGO</div>

      <div className="w-full flex flex-col gap-1">
        <input
          onChange={() => {}}
          placeholder="Search for user"
          className="bg-light px-3 py-2 rounded-xl ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2">
        <div
          onClick={() => setActiveFilter("all")}
          className={`bg-light px-4 py-1 border rounded-2xl transition duration-200 ${activeFilter === "all" ? "text-text border-color" : "text-muted-foreground border-gray-700"}`}
        >
          All
        </div>
        <div
          onClick={() => setActiveFilter("unread")}
          className={`bg-light px-4 py-1 border rounded-2xl transition duration-200 ${activeFilter === "unread" ? "text-text border-color" : "text-muted-foreground border-gray-700"}`}
        >
          Unread
        </div>
      </div>

      <ConversationList />
    </aside>
  );
};
