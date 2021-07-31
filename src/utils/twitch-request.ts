import { TWITCH_CLIENT_ID } from "~/constants";
import { ApiClient, ApiClientResponse, ApiServiceOptions } from "./api-client";
import { RequestError } from "./request-error";

let logoutCallback: (() => void) | null = null;

export const twitchApiClient = new ApiClient({
  headers: {
    Accept: "application/json",
    "Client-ID": TWITCH_CLIENT_ID,
  },
});

export interface TwitchHelixResponse<T> {
  data: T[];
}

export function onLogout(cb: () => void) {
  logoutCallback = cb;
}

export function setTwitchApiToken(token: string | null) {
  if (token) {
    twitchApiClient.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete twitchApiClient.headers["Authorization"];
  }
}

export function twitchApiRequest<T>(options: ApiServiceOptions<T>): unknown {
  options.onLoadStart && options.onLoadStart();
  return twitchApiClient
    .request<T>(options)
    .then((response: ApiClientResponse<T>) => {
      options.onLoadEnd && options.onLoadEnd();
      if (response.status !== 200) {
        if (response.status === 401) {
          logoutCallback?.();
        } else {
          throw new Error(
            `Non 200 http status code returned: ${response.status}`
          );
        }
      } else {
        return options.onSuccess && options.onSuccess(response.data as T);
      }
    })
    .catch((error) => {
      options.onLoadEnd && options.onLoadEnd();
      console.log(error);
      options.onError &&
        options.onError(new RequestError(error.toString(), 500));
    });
}
