import { Injectable, InternalServerErrorException } from '@nestjs/common';
import qs from 'qs';
import { z } from 'zod';
import { User } from './entities/user.entity';

@Injectable()
export class SpotifyScrappingService {
  private clientURL = 'https://open.spotify.com';
  private privateAPIURL = 'https://api-partner.spotify.com/pathfinder/v1';

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

  async query(token: string, searchTerm: string) {
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
    const url = `${this.privateAPIURL}/query?${queryParams}`;

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

  async queryUsers(identifier: string): Promise<User[]> {
    const { ['accessToken']: token } = await this.getAccessToken();
    const response = await this.query(token, identifier);
    const { users } = response.data.searchV2;

    return users.items.map((item) => {
      const { data } = item;
      const { id, displayName, avatar } = data;

      return { id, displayName, avatar };
    });
  }
}
