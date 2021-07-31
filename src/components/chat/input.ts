import {
  ConnectionManagerController,
  ConnectionManagerEvents,
} from "~/controllers/connection-manager";
import { Component } from "~/core/component";
import { Channel } from "~/models/channel";
import styles from "./input.module.scss";

export function CreateChatInput(channel: Channel) {
  const t = Component.create<HTMLTextAreaElement>("textarea")
    .placeholder("Send a chat message...")
    .setClassName(styles.field);

  t.onKeydown((event) => {
    if (event.key !== "Enter") {
      return;
    }
    const content = t.ref().value;
    t.ref().value = "";
    ConnectionManagerController.publish(ConnectionManagerEvents.Send, {
      channel,
      content,
    });
    return false;
  });

  const c = Component.create("div").setClassName(styles.container).addChild(t);

  return c;
}
