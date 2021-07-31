import { IRCMessage, parse } from "irc-message-ts";
import { ChatEvents, GlobalChatController } from "~/controllers/chat";

const newlineRx = /[\r\n]+/g;

export class ChatConnection {
  private conn: WebSocket | null = null;
  private forceDisconnect = false;
  private joinedChannels = new Set<string>();

  public constructor(private login: string, private pass: string) {}

  public connect() {
    this.conn = new WebSocket("wss://irc-ws.chat.twitch.tv/");
    this.forceDisconnect = false;

    const cancel = setTimeout(() => {
      this.conn?.close();
      this.conn = null;
      setTimeout(() => this.connect(), 1000);
    }, 5000);

    this.conn.onclose = () => {
      if (this.forceDisconnect) {
        return;
      }

      setTimeout(() => this.connect(), 1000);
    };

    this.conn.onopen = () => {
      clearTimeout(cancel);
      this.send("CAP REQ :twitch.tv/commands twitch.tv/tags");
      this.send("PASS oauth:" + this.pass);
      this.send("NICK " + this.login);
      this.joinedChannels.forEach((login) => this.send("JOIN #" + login));
    };

    this.conn.onmessage = (event) => {
      const lines = event.data.split(newlineRx);
      for (let i = 0; i < lines.length; ++i) {
        this.handleLine(lines[i]);
      }
    };
  }

  public send(line: string) {
    this.conn?.readyState === WebSocket.OPEN && this.conn?.send(line);
  }

  public join(login: string) {
    !this.joinedChannels.has(login) && this.send("JOIN #" + login);
    this.joinedChannels.add(login);
  }

  public part(login: string) {
    this.joinedChannels.has(login) && this.send("PART #" + login);
    this.joinedChannels.delete(login);
  }

  public disconnect() {
    this.forceDisconnect = true;
    this.conn?.close();
  }

  private handleLine(line: string) {
    const message = parse(line);
    if (!message) {
      return;
    }

    switch (message.command) {
      case "PRIVMSG": {
        this.handleMessage(message);
        break;
      }

      case "CLEARCHAT": {
        // todo handle clearchats
      }
    }
  }

  private handleMessage(message: IRCMessage) {
    GlobalChatController.publish(ChatEvents.Message, {
      id: message.tags?.id || "",
      content: message.trailing,
      badges: this.parseBadges(message.tags.badges || ""),
      channel: {
        twitchId: message.tags["room-id"] || "",
        login: message.param?.substring(1) || "",
      },
      user: {
        id: message.tags["user-id"] || "",
        login: (message.prefix || "").split("!")?.[0] || "",
        displayName: message.tags["display-name"] || "",
        color: message.tags.color || "",
        moderator: !!message.tags.mod,
      },
    });
  }

  private parseBadges(badgesStr: string): [string, string][] {
    const spl = badgesStr.split(",");
    const resp: [string, string][] = [];

    for (let i = 0; i < spl.length; ++i) {
      const [name, version] = spl[i].split("/");
      if (name && version) {
        resp.push([name, version]);
      }
    }

    return resp;
  }
}
