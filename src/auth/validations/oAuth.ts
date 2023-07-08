import { z } from 'zod';

const oAuthDataSchema = z.object({
  provider: z.string(),
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  profileUrl: z.string(),
  photos: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  country: z.string(),
  followers: z.number(),
  product: z.string(),
  emails: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  _raw: z.string(),
  _json: z.object({
    display_name: z.string(),
    external_urls: z.object({
      spotify: z.string(),
    }),
    href: z.string(),
    id: z.string(),
    images: z.array(
      z.object({
        url: z.string(),
        height: z.number(),
        width: z.number(),
      }),
    ),
    type: z.string(),
    uri: z.string(),
    followers: z.object({
      href: z.null(),
      total: z.number(),
    }),
    country: z.string(),
    product: z.string(),
    explicit_content: z.object({
      filter_enabled: z.boolean(),
      filter_locked: z.boolean(),
    }),
    email: z.string(),
  }),
});

export function validateOAuthData(payload: unknown) {
  const validation = oAuthDataSchema.safeParse(payload);
  const { success } = validation;

  return success ? validation.data : undefined;
}
