import { Emitter } from "~/core/emitter";
import { Channel } from "~/models/channel";

export enum ConnectionManagerEvents {
  Join,
  Part,
  Connected,
  Disconnected,
  Send,
}

export interface ConnectionPayload {
  login: string;
  twitchId: string;
}

export interface SendPayload {
  channel: Channel;
  content: string;
}

type EventSchemas = ConnectionPayload | SendPayload;

class ConnectionManagerControllerImpl extends Emitter<
  ConnectionManagerEvents,
  EventSchemas
> {}

export const ConnectionManagerController =
  new ConnectionManagerControllerImpl();
