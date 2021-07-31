import { Component } from "~/core/component";
import { ChatMessage } from "~/models/chat";

export function CreateChatContent(message: ChatMessage) {
  return Component.create("span").setText(message.content);
}
