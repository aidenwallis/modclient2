import { ViewController } from "./views/controller";

export class App {
  private viewController = new ViewController();

  public constructor(private root: HTMLElement) {}

  public static create(root: HTMLElement) {
    return new App(root);
  }

  public start() {
    this.root.appendChild(this.viewController.ref());
    this.viewController.start();
  }
}
