import { Emitter } from "~/core/emitter";

export enum ConnectionManagerEvents {
  Join,
  Part,
  Connected,
  Disconnected,
}

export interface ConnectionPayload {
  login: string;
  twitchId: string;
}

type EventSchemas = ConnectionPayload;

class ConnectionManagerControllerImpl extends Emitter<
  ConnectionManagerEvents,
  EventSchemas
> {}

export const ConnectionManagerController =
  new ConnectionManagerControllerImpl();
