"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import { RequestModal } from "./RequestModal";
import { useDebounce } from "@/hooks/useDebounce";
import { FriendRequestStatus } from "@/types/enums";

type SearchedUsers = {
  id: number;
  email: string;
  username: string;
  friendStatus: FriendRequestStatus;
};

export const RequestSearch = () => {
  const [search, setSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isOpen = isFocused && search.length > 0;

  const debouncedSearch = useDebounce(search);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["search-users", debouncedSearch],
    queryFn: async () => {
      const req = await api.get<SearchedUsers[]>(
        `/user/search/${debouncedSearch.trim()}`,
      );
      return req.data;
    },
    enabled: debouncedSearch.trim().length > 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          setIsFocused(Boolean(value));
        }}
        placeholder="Search for users"
        className="w-full text-sm bg-light px-3 py-2 rounded-t-xl ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />

      {isOpen && (
        <RequestModal
          isLoading={isLoading}
          users={users}
          searched={debouncedSearch}
        />
      )}
    </div>
  );
};
