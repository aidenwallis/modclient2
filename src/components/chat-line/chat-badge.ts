import { BadgeController } from "~/controllers/badges";
import { Component } from "~/core/component";
import { ChatBadge } from "~/models/chat";
import { TwitchBadgeVersion } from "~/services/models/twitch";
import styles from "./chat-badge.module.scss";

export function CreateChatBadge(badge: TwitchBadgeVersion) {
  return Component.create("img")
    .src(badge.image_url_1x)
    .setClassName(styles.badge);
}

export function CreateChatBadges(channelId: string, badgeSets: ChatBadge[]) {
  const badges = BadgeController.getBadges(channelId, badgeSets);
  const c = Component.create("span");

  for (let i = 0; i < badges.length; ++i) {
    c.addChild(CreateChatBadge(badges[i]));
  }

  return c;
}
