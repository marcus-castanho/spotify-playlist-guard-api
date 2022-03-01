export type JwtPayload = {
  name: string;
  sub: string;
  roles: Role[];
};
