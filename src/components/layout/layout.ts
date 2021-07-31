import { AuthData } from "~/controllers/auth";
import { BadgeController } from "~/controllers/badges";
import {
  ChatController,
  ChatEvents,
  GlobalChatController,
} from "~/controllers/chat";
import {
  ConnectionManagerController,
  ConnectionManagerEvents,
  ConnectionPayload,
  SendPayload,
} from "~/controllers/connection-manager";
import { Component } from "~/core/component";
import { CoreStorage } from "~/core/storage";
import { Channel } from "~/models/channel";
import { ChatConnection } from "~/utils/chat-connection";
import { CreateChat } from "../chat/chat";
import styles from "./styles.module.scss";

const channelsKey = "modclient/channels";
const newlineRx = /\n/g;

export function CreateLayout(auth: AuthData) {
  const channels = CoreStorage.get<Channel[]>(channelsKey, []);
  const readConnection = new ChatConnection(auth.login, auth.token);
  const writeConnection = new ChatConnection(auth.login, auth.token);
  const emitters = new Map<string, ChatController>();

  const unsubscribeJoin = ConnectionManagerController.subscribe(
    ConnectionManagerEvents.Join,
    (channel: ConnectionPayload) => {
      readConnection.join(channel.login);
    }
  );

  const unsubscribePart = ConnectionManagerController.subscribe(
    ConnectionManagerEvents.Part,
    (channel: ConnectionPayload) => {
      readConnection.part(channel.login);
      // cleanup old emitters
      emitters.delete(channel.twitchId);
    }
  );

  const unsubscribeMessages = GlobalChatController.subscribe(
    ChatEvents.Message,
    (message) => {
      const emitter = emitters.get(message.channel.twitchId);
      if (emitter) {
        // only the child channel should get the event past the global controller
        emitter.publish(ChatEvents.Message, message);
      }
    }
  );

  const unsubscribeSend = ConnectionManagerController.subscribe(
    ConnectionManagerEvents.Send,
    (event: SendPayload) => {
      writeConnection.send(
        `PRIVMSG #${event.channel.login} :${event.content.replace(
          newlineRx,
          ""
        )}`
      );
    }
  );

  BadgeController.loadGlobal();

  return Component.create("div")
    .setClassName(styles.container)
    .onMount(function (this: Component) {
      readConnection.connect();
      writeConnection.connect();

      for (let i = 0; i < channels.length; ++i) {
        const channel = channels[i];
        const emitter = new ChatController();
        console.log(channel);
        if (!emitters.has(channel.twitchId)) {
          emitters.delete(channel.twitchId); // discard old emitter
          emitters.set(channel.twitchId, emitter);
        }
        this.addChild(CreateChat(channel, emitter));
      }
    })
    .onUnmount(() => {
      readConnection.disconnect();
      writeConnection.disconnect();

      unsubscribeJoin();
      unsubscribePart();
      unsubscribeMessages();
      unsubscribeSend();
    });
}
