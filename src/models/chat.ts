import { Channel } from "./channel";

export interface ChatUser {
  displayName: string;
  color: string | null;
  moderator: boolean;
  id: string;
  login: string;
}

// [name, version] tuple
export type ChatBadge = [string, string];

export interface ChatMessage {
  id: string;
  content: string;
  channel: Channel;
  badges: ChatBadge[];
  user: ChatUser;
}
