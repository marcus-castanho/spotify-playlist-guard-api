import { Injectable, InternalServerErrorException } from '@nestjs/common';
import qs from 'qs';
import { z } from 'zod';
import { User } from './entities/user.entity';

@Injectable()
export class SpotifyScrappingService {
  private clientURL = 'https://open.spotify.com';
  private privateQueriesAPIURL =
    'https://api-partner.spotify.com/pathfinder/v1';
  private privateUserAPIURL =
    'https://spclient.wg.spotify.com/user-profile-view/v3';

  async getAccessToken() {
    const response = await fetch(`${this.clientURL}/get_access_token`);
    const resBody = await response.json().catch(() => ({}));

    const resBodySchema = z.object({
      clientId: z.string(),
      accessToken: z.string(),
      accessTokenExpirationTimestampMs: z.number(),
      isAnonymous: z.boolean(),
    });

    const validation = resBodySchema.safeParse(resBody);

    if (!validation.success) {
      throw new InternalServerErrorException();
    }

    return validation.data;
  }

  async query(searchTerm: string) {
    const { ['accessToken']: token } = await this.getAccessToken();
    const queryParams = qs.stringify({
      operationName: 'searchUsers',
      variables: JSON.stringify({
        searchTerm,
        offset: 0,
        limit: 30,
      }),
      extensions: JSON.stringify({
        persistedQuery: {
          version: 1,
          sha256Hash:
            'f82af76fbfa6f57a45e0f013efc0d4ae53f722932a85aca18d32557c637b06c8',
        },
      }),
    });
    const url = `${this.privateQueriesAPIURL}/query?${queryParams}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resBody = await response.json().catch(() => ({}));

    const resBodySchema = z.object({
      data: z.object({
        searchV2: z.object({
          query: z.string(),
          users: z.object({
            totalCount: z.number(),
            items: z.array(
              z.object({
                data: z.object({
                  __typename: z.string(),
                  uri: z.string(),
                  id: z.string(),
                  displayName: z.string(),
                  username: z.string(),
                  avatar: z
                    .object({
                      sources: z.array(
                        z.object({
                          url: z.string(),
                          width: z.number(),
                          height: z.number(),
                        }),
                      ),
                    })
                    .or(z.null())
                    .optional(),
                  extractedColors: z
                    .object({
                      colorDark: z.object({
                        hex: z.string(),
                        isFallback: z.boolean(),
                      }),
                    })
                    .optional(),
                }),
              }),
            ),
            pagingInfo: z.object({
              nextOffset: z.number().or(z.null()),
              limit: z.number(),
            }),
          }),
        }),
      }),
      extensions: z.object({
        requestIds: z.object({
          '/searchV2': z.object({
            'search-api': z.string(),
          }),
        }),
      }),
    });

    const validation = resBodySchema.safeParse(resBody);

    if (!validation.success) {
      throw new InternalServerErrorException();
    }

    return validation.data;
  }

  async getUserProfile(userId: string) {
    const { ['accessToken']: token } = await this.getAccessToken();
    const queryParams = qs.stringify({
      playlist_limit: 10,
      artist_limit: 10,
      episode_limit: 10,
      market: 'from_token',
    });

    const url = `${this.privateUserAPIURL}/profile/${userId}?${queryParams}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resBody = await response.json().catch(() => ({}));

    const resBodySchema = z.object({
      uri: z.string(),
      name: z.string(),
      image_url: z.string(),
      has_spotify_image: z.boolean(),
      color: z.number(),
      allow_follows: z.boolean(),
      show_follows: z.boolean(),
      has_spotify_name: z.boolean().optional(),
      is_current_user: z.boolean().optional(),
      followers_count: z.number().optional(),
      following_count: z.number().optional(),
      public_playlists: z
        .array(
          z.object({
            followers_count: z.number(),
            image_url: z.string(),
            name: z.string(),
            uri: z.string(),
          }),
        )
        .optional(),
      total_public_playlists_count: z.number().optional(),
    });

    const validation = resBodySchema.safeParse(resBody);

    if (!validation.success) {
      throw new InternalServerErrorException();
    }

    return validation.data;
  }

  async queryUsers(identifier: string): Promise<User[]> {
    const response = await this.query(identifier);
    const { users } = response.data.searchV2;

    return users.items.map((item) => {
      const { data } = item;
      const { id, displayName, avatar } = data;

      return { id, displayName, avatar };
    });
  }

  async findUser(userId: string) {
    const response = await this.getUserProfile(userId);
    const { name, image_url } = response;

    return {
      id: userId,
      name,
      image_url,
    };
  }
}
