import { FullCenter } from "~/containers/full-center";
import { Component } from "~/core/component";
import { LoginButton } from "./components/login-button/login-button";
import styles from "./styles.module.scss";

export const AuthView = FullCenter(
  Component.create("div").setClassName(styles.container).addChild(LoginButton)
);
