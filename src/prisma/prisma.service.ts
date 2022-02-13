import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
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
