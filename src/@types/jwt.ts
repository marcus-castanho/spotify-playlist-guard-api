import { Role } from './role.enum';

export type JwtPayloadAdmin = {
  name: string;
  sub: string;
  roles: Role[number][];
  iat: number;
  exp: number;
};

export type JwtPayloadUser = {
  sub: string;
  iat: number;
  exp: number;
};

export type JwtPayload<T extends string = ''> =
  | Omit<JwtPayloadAdmin, T>
  | Omit<JwtPayloadUser, T>;
