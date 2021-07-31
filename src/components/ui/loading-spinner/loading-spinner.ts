import { Component } from "~/core/component";
import styles from "./loading-spinner.module.scss";

const makeSpinner = (i: number) =>
  Component.create("div").setClassName(
    `${styles["circle" + i]} ${styles.child}`
  );

export const LoadingSpinner = Component.create("div")
  .setClassName(styles.circle)
  .addChild(makeSpinner(1))
  .addChild(makeSpinner(2))
  .addChild(makeSpinner(3))
  .addChild(makeSpinner(4))
  .addChild(makeSpinner(5))
  .addChild(makeSpinner(5))
  .addChild(makeSpinner(6))
  .addChild(makeSpinner(7))
  .addChild(makeSpinner(8))
  .addChild(makeSpinner(9))
  .addChild(makeSpinner(10))
  .addChild(makeSpinner(11))
  .addChild(makeSpinner(12));
