"use client";
import Link from "next/link";
import { MessageSquare, Settings, UserRoundPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

const routes = [
  {
    href: "/",
    label: "Chats",
    Icon: MessageSquare,
  },
  {
    href: "/requests",
    label: "Requests",
    Icon: UserRoundPlus,
  },
  {
    href: "/settings",
    label: "Settings",
    Icon: Settings,
  },
];

export const Navbar = () => {
  const pathname = usePathname();
  const isConversationOpen = pathname.startsWith("/conversation/");

  return (
    <nav
      className={twMerge(
        "order-3 lg:order-1 bg-bg px-4 py-4 lg:px-2 border-t lg:border-t-transparent lg:border-r border-color flex lg:flex-col items-center justify-between lg:justify-normal gap-2 lg:gap-4",
        isConversationOpen && "hidden lg:flex",
      )}
    >
      {routes.map(({ Icon, href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/" || pathname.startsWith("/conversation/")
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={twMerge(
              "flex flex-col items-center gap-2 p-3 text-sm rounded-lg font-lato font-medium transition-colors",
              isActive
                ? "bg-light text-text border border-color"
                : "text-muted-foreground hover:text-text hover:bg-light border border-transparent hover:border-color",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary",
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs sm:text-sm md:text-base">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
