import { BadgeController } from "~/controllers/badges";
import { ChatController } from "~/controllers/chat";
import {
  ConnectionManagerController,
  ConnectionManagerEvents,
} from "~/controllers/connection-manager";
import { Component } from "~/core/component";
import { Channel } from "~/models/channel";
import { CreateInfo } from "../chat-info/info";
import styles from "./chat.module.scss";
import { CreateChatInput } from "./input";
import { CreateChatMessages } from "./messages";

export function CreateChat(
  channel: Channel,
  controller: ChatController
): Component {
  return Component.create("div")
    .setClassName(styles.chat)
    .onMount(() => {
      BadgeController.loadUser(channel.twitchId);
      ConnectionManagerController.publish(
        ConnectionManagerEvents.Join,
        channel
      );
    })
    .onUnmount(() => {
      ConnectionManagerController.publish(
        ConnectionManagerEvents.Part,
        channel
      );
    })
    .addChild(CreateInfo(channel))
    .addChild(CreateChatMessages(controller))
    .addChild(CreateChatInput(channel));
}
