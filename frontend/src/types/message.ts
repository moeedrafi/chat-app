import type { User } from "./user";

export enum MessageStatus {
  SENT = "sent",
  READ = "read",
}

export interface Message {
  id: string;
  sender: User;
  message: string;
  seen_at: string;
  createdAt: string;
  status: MessageStatus;
}
