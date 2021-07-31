import { Emitter } from "~/core/emitter";
import { ChatMessage } from "~/models/chat";

export enum ChatEvents {
  Message,
  Notice,
}

export type ChatMessageEvent = ChatMessage;

type EventSchemas = ChatMessageEvent;

export class ChatController extends Emitter<ChatEvents, EventSchemas> {}

export const GlobalChatController = new ChatController();
