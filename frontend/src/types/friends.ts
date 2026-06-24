import type { User } from "./user";

export interface PendingRequest {
  id: string;
  sender: User;
}

export interface FriendList {
  id: string;
  userId: number;
  username: string;
  conversationId: string;
}
