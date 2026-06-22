export interface SearchedUsers {
  id: number;
  email: string;
  username: string;
  relationshipStatus: "NONE" | "FRIENDS" | "PENDING";
}
