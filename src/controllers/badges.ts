import { ChatBadge } from "~/models/chat";
import { TwitchBadge, TwitchBadgeVersion } from "~/services/models/twitch";
import { ApiClientMethod } from "~/utils/api-client";
import { preloadImage } from "~/utils/preload-image";
import { twitchApiRequest, TwitchHelixResponse } from "~/utils/twitch-request";

export interface Badge {
  id: string;
  versions: Record<string, TwitchBadgeVersion>;
}

export type BadgeSets = Record<string, Badge>;

class BadgeControllerImpl {
  private channelBadges: Record<string, BadgeSets> = {};
  private globalBadges: BadgeSets = {};

  public getBadges(
    channelId: string,
    badges: ChatBadge[]
  ): TwitchBadgeVersion[] {
    const channelBadges: BadgeSets = this.channelBadges[channelId] || {};
    const resp: TwitchBadgeVersion[] = [];
    for (let i = 0; i < badges.length; ++i) {
      const [name, version] = badges[i];

      const channelBadge = channelBadges[name];
      if (channelBadge && channelBadge.versions[version]) {
        resp.push(channelBadge.versions[version]);
        continue;
      }

      const globalBadge = this.globalBadges[name];
      if (globalBadge && globalBadge.versions[version]) {
        resp.push(globalBadge.versions[version]);
        continue;
      }
    }

    return resp;
  }

  public loadGlobal() {
    twitchApiRequest({
      method: ApiClientMethod.GET,
      url: "https://api.twitch.tv/helix/chat/badges/global",
      onSuccess: (body: TwitchHelixResponse<TwitchBadge>) => {
        this.globalBadges = this.parseBadgeResponse(body?.data || []);
      },
      onError: (error) => {
        console.error("Failed to load global badges, retrying in 5s.", error);
        setTimeout(() => this.loadGlobal(), 5000);
      },
    });
  }

  public loadUser(userId: string) {
    twitchApiRequest({
      method: ApiClientMethod.GET,
      url: `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${encodeURIComponent(
        userId
      )}`,
      onSuccess: (body: TwitchHelixResponse<TwitchBadge>) => {
        this.channelBadges[userId] = this.parseBadgeResponse(body?.data || []);
      },
      onError: (error) => {
        console.error(
          `Failed to load badges for [${userId}], retrying in 5s.`,
          error
        );
        setTimeout(() => this.loadUser(userId), 5000);
      },
    });
  }

  private parseBadgeResponse(badges: TwitchBadge[]) {
    return badges.reduce((acc, cur) => {
      acc[cur.set_id] = {
        id: cur.set_id,
        versions: cur.versions.reduce((a, c) => {
          a[c.id] = c;
          preloadImage(c.image_url_1x);
          return a;
        }, {} as Record<string, TwitchBadgeVersion>),
      };
      return acc;
    }, {} as BadgeSets);
  }
}

export const BadgeController = new BadgeControllerImpl();
