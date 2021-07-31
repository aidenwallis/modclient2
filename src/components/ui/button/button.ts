import { Component } from "~/core/component";
import styles from "./styles.module.scss";

const create = (cn: string) =>
  Component.create("button").setClassName(styles.button + " " + cn);

export const ButtonText = (text: string) =>
  Component.create("span").setClassName(styles.text).setText(text);

export const PrimaryButton = (component: Component | string) => {
  return create(styles.primary).addChild(
    typeof component === "string" ? ButtonText(component) : component
  );
};
