import { z } from 'zod';
import {
  adminJwtPayloadSchema,
  userJwtPayloadSchema,
} from 'src/auth/validations/jwt';

export type JwtPayloadAdmin = z.infer<typeof adminJwtPayloadSchema>;

export type JwtPayloadUser = z.infer<typeof userJwtPayloadSchema>;

export type JwtPayload<T extends string = ''> =
  | Omit<JwtPayloadAdmin, T>
  | Omit<JwtPayloadUser, T>;
