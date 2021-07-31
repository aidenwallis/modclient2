import { PrimaryButton } from "~/components/ui/button/button";
import { TWITCH_AUTHORIZE_URL } from "~/constants";

export const LoginButton = PrimaryButton("Log in With Twitch").onClick(() => {
  window.location.href = TWITCH_AUTHORIZE_URL;
});
