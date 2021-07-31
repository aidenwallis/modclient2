import { Component } from "~/core/component";
import styles from "./styles.module.scss";

export const FullCenter = (child: Component) =>
  Component.create("div").setClassName(styles.container).addChild(child);
