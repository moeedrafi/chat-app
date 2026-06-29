export const queryKeys = {
  me: () => ["user"] as const,

  userInformation: (conversationId: string) =>
    ["user-information", conversationId] as const,

  messages: (conversationId: string) => ["messages", conversationId] as const,

  searchUsers: (debouncedSearch: string) =>
    ["search-users", debouncedSearch] as const,

  pendingRequest: () => ["pending-request"] as const,

  friends: () => ["friends"] as const,
};
