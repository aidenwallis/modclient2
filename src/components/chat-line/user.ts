import { Component } from "~/core/component";
import { ChatUser } from "~/models/chat";
import styles from "./user.module.scss";

const createDisplayName = (user: ChatUser) => {
  const lowerDisplayName = user.displayName.toLowerCase();
  if (lowerDisplayName === user.login) {
    return user.displayName;
  }
  return `${user.displayName} (${user.login})`;
};

export function CreateChatUser(user: ChatUser) {
  return Component.create("span")
    .setClassName(styles.name)
    .setColor(user.color || "#aaa")
    .data("trigger", "user-card")
    .data("userId", user.id)
    .data("userLogin", user.login)
    .data("userDisplayName", user.displayName)
    .setText(createDisplayName(user) + ": ");
}
