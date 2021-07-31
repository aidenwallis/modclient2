export interface TwitchValidateResponse {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
}

export interface TwitchBadgeVersion {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_3x: string;
}

export interface TwitchBadge {
  set_id: string;
  versions: TwitchBadgeVersion[];
}
