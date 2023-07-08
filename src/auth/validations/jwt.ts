import { z } from 'zod';

export const adminJwtPayloadSchema = z.object({
  name: z.string(),
  sub: z.string(),
  roles: z.array(z.string()),
  iat: z.number(),
  exp: z.number(),
});

export function validateAdminJwtPayload(payload: unknown) {
  const validation = adminJwtPayloadSchema.safeParse(payload);
  const { success } = validation;

  return success ? validation.data : undefined;
}

export const userJwtPayloadSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export function validateUserJwtPayload(payload: unknown) {
  const validation = userJwtPayloadSchema.safeParse(payload);
  const { success } = validation;

  return success ? validation.data : undefined;
}
