import type { User } from "./user";
import { FriendRequestStatus } from "./enums";

export interface PendingRequest {
  id: string;
  status: FriendRequestStatus.PENDING;
  created_at: string;
  updated_at: string;
  sender: User;
}
