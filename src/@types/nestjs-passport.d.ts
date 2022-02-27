import { IAuthModuleOptions } from '@nestjs/passport';

export interface AuthModuleOptions extends IAuthModuleOptions {
  successRedirect: string;
  failureRedirect: string;
}
