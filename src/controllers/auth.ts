import { Emitter } from "~/core/emitter";
import { CoreStorage } from "~/core/storage";
import { TwitchValidateResponse } from "~/services/models/twitch";
import { ApiClientMethod } from "~/utils/api-client";
import { setTwitchApiToken, twitchApiRequest } from "~/utils/twitch-request";

export enum AuthEvents {
  Authenticated,
  Unauthenticated,
}

const tokenKey = "modclient/token";

export type UnauthorizedSchema = boolean;
export type AuthorizedSchema = {};

type EventSchema = UnauthorizedSchema | AuthorizedSchema;

export interface AuthData {
  clientId: string;
  login: string;
  scopes: string[];
  token: string;
  userId: string;
}

export interface TokenPayload {
  token: string;
  scopes: string[];
}

class AuthControllerImpl extends Emitter<AuthEvents, EventSchema> {
  public authorized = true;
  private data_: TwitchValidateResponse | null = null;
  public token = CoreStorage.getOptional<TokenPayload>(tokenKey);

  public get data(): AuthData {
    if (!this.data_) {
      throw new Error("Not authenticated");
    }
    return {
      clientId: this.data_.client_id,
      login: this.data_.login,
      scopes: this.data_.scopes,
      token: this.token?.token || "",
      userId: this.data_.user_id,
    };
  }

  public bootstrap() {
    if (this.hasHash()) {
      return;
    }
    if (!this.token || !this.validateToken()) {
      this.authorized = false;
      this.logout();
      return;
    }
    setTwitchApiToken(this.token.token);

    twitchApiRequest({
      method: ApiClientMethod.GET,
      url: "https://id.twitch.tv/oauth2/validate",
      headers: { Authorization: `OAuth ${this.token.token}` },
      onError: () => this.logout(),
      onSuccess: (body: TwitchValidateResponse) => {
        this.data_ = body;
        this.publish(AuthEvents.Authenticated, {});
      },
    });
  }

  private hasHash() {
    const hash = (window.location.hash || "").substring(1);
    const vals = hash.split("&").reduce((acc, cur) => {
      const [key, val] = cur.split("=");
      acc[key] = decodeURIComponent(val);
      return acc;
    }, {} as Record<string, string>);

    const token = vals.access_token;
    const scopes = (vals.scope || "").split(" ");
    const tokenType = vals.token_type;

    if (!(token && scopes.length && tokenType) || tokenType !== "bearer") {
      return false;
    }

    window.location.hash = "";

    const payload: TokenPayload = { token, scopes };
    this.token = payload;
    CoreStorage.set(tokenKey, payload);
  }

  private validateToken() {
    if (typeof this.token?.token !== "string") {
      return false;
    }
    if (!Array.isArray(this.token?.scopes)) {
      return false;
    }
    return true;
  }

  public logout() {
    const previouslyAuthed = this.authorized;
    this.authorized = false;
    CoreStorage.delete(tokenKey);
    this.publish(AuthEvents.Unauthenticated, previouslyAuthed);
  }
}

export const AuthController = new AuthControllerImpl();
