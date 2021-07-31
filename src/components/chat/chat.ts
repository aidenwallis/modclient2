import {
  ConnectionManagerController,
  ConnectionManagerEvents,
} from "~/controllers/connection-manager";
import { Component } from "~/core/component";
import { Channel } from "~/models/channel";

export function CreateChat(channel: Channel): Component {
  return Component.create("div")
    .onMount(() => {
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
    });
}
