import { CreateLayout } from "~/components/layout/layout";
import { TWITCH_AUTHORIZE_URL } from "~/constants";
import {
  AuthController,
  AuthEvents,
  UnauthorizedSchema,
} from "~/controllers/auth";
import { Component } from "~/core/component";
import { ChatConnection } from "~/utils/chat-connection";
import { AuthView } from "./auth/auth";
import styles from "./controller.module.scss";
import { LoadingView } from "./loading/loading";

export class ViewController {
  private element = Component.create("div").setClassName(
    `${styles.container} ${styles.dark}`
  );

  public constructor() {
    AuthController.subscribe(
      AuthEvents.Unauthenticated,
      (alreadyAuthed: UnauthorizedSchema) => {
        if (alreadyAuthed) {
          window.location.href = TWITCH_AUTHORIZE_URL;
          return;
        }
        this.setAuth();
      }
    );

    AuthController.subscribe(AuthEvents.Authenticated, () => {
      this.setMain();
    });
  }

  public mount() {
    this.element.mount();
  }

  public ref() {
    return this.element.ref();
  }

  public start() {
    this.setLoading();
    AuthController.bootstrap();
  }

  private setAuth() {
    this.element.removeAllChildren();
    this.element.addChild(AuthView);
  }

  private setMain() {
    this.element.removeAllChildren();
    this.element.addChild(CreateLayout(AuthController.data));
  }

  private setLoading() {
    this.element.removeAllChildren();
    this.element.addChild(LoadingView);
  }
}
