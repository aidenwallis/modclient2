import { Component } from "~/core/component";
import { ChatMessage } from "~/models/chat";
import { CreateChatBadges } from "./chat-badge";
import styles from "./chat-line.module.scss";
import { CreateChatContent } from "./content";
import { CreateChatUser } from "./user";

export function CreateChatline(message: ChatMessage) {
  return Component.create("div")
    .setClassName(styles.line)
    .addChild(CreateChatBadges(message.channel.twitchId, message.badges))
    .addChild(CreateChatUser(message.user))
    .addChild(CreateChatContent(message));
}
