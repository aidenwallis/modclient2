import "./scss/_global.scss";
import { App } from "./app";

(() => {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("Can't start app");
  }

  App.create(root).start();
})();
