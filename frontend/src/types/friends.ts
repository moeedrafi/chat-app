import type { User } from "./user";
import { FriendRequestStatus } from "./enums";

export interface PendingRequest {
  id: string;
  status: FriendRequestStatus.PENDING;
  sender: User;
}
