export const TWITCH_CLIENT_ID = "292iqn01thyi8k3xru68svjbu4druw";
export const TWITCH_REDIRECT_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:1234"
    : "https://modclient.aidenwallis.co.uk";
export const TWITCH_SCOPES = [
  "channel:moderate",
  "chat:edit",
  "chat:read",
].sort();
export const TWITCH_AUTHORIZE_URL =
  "https://id.twitch.tv/oauth2/authorize?" +
  ("client_id=" +
    TWITCH_CLIENT_ID +
    "&redirect_uri=" +
    encodeURIComponent(TWITCH_REDIRECT_URL) +
    "&response_type=token" +
    "&scope=" +
    encodeURIComponent(TWITCH_SCOPES.join(" ")));
