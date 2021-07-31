import { ChatController, ChatEvents } from "~/controllers/chat";
import { Component } from "~/core/component";
import { ChatMessage } from "~/models/chat";
import { CreateChatline } from "../chat-line/chat-line";
import styles from "./messages.module.scss";

const MAX_CHAT_SCROLLBACK = 10;

export function CreateChatMessages(controller: ChatController) {
  const c = Component.create("div").setClassName(styles.container);

  const purgeBacklog = () => {
    while (c.getChildren().length > MAX_CHAT_SCROLLBACK) {
      c.removeChild(0);
    }
  };

  const unsubscribeMessages = controller.subscribe(
    ChatEvents.Message,
    (message: ChatMessage) => {
      c.addChild(CreateChatline(message));
      purgeBacklog();
    }
  );

  const unsubscribeNotices = controller.subscribe(ChatEvents.Notice, () => {
    console.log("notice");
  });

  c.onUnmount(() => {
    unsubscribeMessages();
    unsubscribeNotices();
  });

  return c;
}
