import { Component } from "~/core/component";
import { Channel } from "~/models/channel";
import styles from "./info.module.scss";

export function CreateInfo(channel: Channel) {
  return Component.create("div")
    .setClassName(styles.info)
    .addChild(
      Component.create("span").setClassName(styles.title).setText(channel.login)
    );
}
