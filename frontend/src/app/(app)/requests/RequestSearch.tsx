"use client";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export const RequestSearch = () => {
  const [search, setSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["search-users", search],
    queryFn: () => {
      return [
        { id: 1, username: "john_doe" },
        { id: 2, username: "nieedoe" },
        { id: 3, username: "ali" },
        { id: 4, username: "john_doe" },
      ];
    },
    enabled: !!search,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsOpen(!!value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        value={search}
        onChange={handleSearch}
        placeholder="Search for users"
        className="w-full text-sm bg-light px-3 py-2 rounded-t-xl ring-1 ring-color focus-visible:ring-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />

      {isOpen && (
        <div className="absolute w-full px-3 py-2 bg-bg ring-1 ring-color rounded-b-lg divide-y divide-color">
          {isLoading ? (
            <div className="py-3 text-sm text-muted">Searching...</div>
          ) : users.length !== 0 ? (
            <div className="py-3 text-sm text-muted">No users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 shrink-0" />
                  <h6 className="text-sm font-medium">{user.username}</h6>
                </div>

                <Button className="px-3 py-0.5">Send</Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
