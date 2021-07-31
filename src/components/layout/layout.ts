import { AuthData } from "~/controllers/auth";
import {
  ConnectionManagerController,
  ConnectionManagerEvents,
  ConnectionPayload,
} from "~/controllers/connection-manager";
import { Component } from "~/core/component";
import { CoreStorage } from "~/core/storage";
import { Channel } from "~/models/channel";
import { ChatConnection } from "~/utils/chat-connection";
import { CreateChat } from "../chat/chat";
import styles from "./styles.module.scss";

const channelsKey = "modclient/channels";

export function CreateLayout(auth: AuthData) {
  const channels = CoreStorage.get<Channel[]>(channelsKey, []);
  const readConnection = new ChatConnection(auth.login, auth.token);
  const writeConnection = new ChatConnection(auth.login, auth.token);

  ConnectionManagerController.subscribe(
    ConnectionManagerEvents.Join,
    (channel: ConnectionPayload) => {
      readConnection.join(channel.login);
    }
  );

  ConnectionManagerController.subscribe(
    ConnectionManagerEvents.Part,
    (channel: ConnectionPayload) => {
      readConnection.part(channel.login);
    }
  );

  return Component.create("div")
    .setClassName(styles.container)
    .onMount(function (this: Component) {
      readConnection.connect();
      writeConnection.connect();

      console.log(channels);

      for (let i = 0; i < channels.length; ++i) {
        this.addChild(CreateChat(channels[i]));
      }
    })
    .onUnmount(() => {
      readConnection.disconnect();
      writeConnection.disconnect();
    });
}
