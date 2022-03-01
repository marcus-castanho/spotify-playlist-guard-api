import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();

    this.$use(async (params, next) => {
      if (
        params.model == 'AdminUser' &&
        ['create', 'update'].includes(params.action)
      ) {
        const adminUser = params.args.data;
        if (adminUser.password) {
          const salt = await bcrypt.genSalt();
          const hash = await bcrypt.hash(adminUser.password, salt);
          adminUser.password = hash;
          params.args.data = adminUser;
        }
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  exclude<ModelType, Key extends keyof ModelType>(
    row: ModelType,
    ...keys: Key[]
  ): Omit<ModelType, Key> {
    for (const key of keys) {
      delete row[key];
    }
    return row;
  }
}
