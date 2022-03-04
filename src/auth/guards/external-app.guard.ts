import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { ExternalAppsService } from 'src/external-apps/external-apps.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ExternalAppGuard implements CanActivate {
  constructor(private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contextId = ContextIdFactory.getByRequest(request);
    const externalAppsService = await this.moduleRef.resolve(
      ExternalAppsService,
      contextId,
      { strict: false },
    );

    const { authorization } = request.headers;
    const { id } = request.query;
    const externalApp = await externalAppsService.findOne(id);

    if (!externalApp) return false;

    const isValidApiKey = bcrypt.compareSync(authorization, externalApp.apiKey);

    if (!isValidApiKey) return false;

    request.user = { id };

    return true;
  }
}
