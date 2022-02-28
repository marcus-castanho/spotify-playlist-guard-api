import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { ApiKey, EncryptedData } from 'src/@types/encryption';
import { PrismaService } from 'src/prisma/prisma.service';
import { promisify } from 'util';
import { CreateExternalAppDto } from './dto/create-external-app.dto';
import { UpdateExternalAppDto } from './dto/update-external-app.dto';
import { ExternalApp } from './entities/external-app.entity';
import { v4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class ExternalAppsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    createExternalAppDto: CreateExternalAppDto,
  ): Promise<Partial<ExternalApp>> {
    const { baseUrl } = createExternalAppDto;

    const externalApp = await this.prismaService.externalApp.findUnique({
      where: { baseUrl },
    });

    if (externalApp) {
      throw new ConflictException(
        'The playlist Spotify ID provided is already registered.',
      );
    }

    const { apiKey, ivApiKey, encryptedApiKey } = await this.generateApiKey();

    const newExternalApp = await this.prismaService.externalApp.create({
      data: {
        ivApiKey,
        apiKey: encryptedApiKey,
        ...createExternalAppDto,
      },
    });

    return {
      apiKey,
      ...this.prismaService.exclude<
        Partial<ExternalApp>,
        keyof Partial<ExternalApp>
      >(newExternalApp, 'ivApiKey', 'apiKey'),
    };
  }

  async findOne(id: string): Promise<Partial<ExternalApp>> {
    const externalApp = await this.prismaService.externalApp.findUnique({
      where: { id },
    });

    if (!externalApp) {
      throw new NotFoundException(
        'No external apps registered with the provided id.',
      );
    }

    return this.prismaService.exclude<
      Partial<ExternalApp>,
      keyof Partial<ExternalApp>
    >(externalApp, 'ivApiKey', 'apiKey');
  }

  async listPage(page: number): Promise<Partial<ExternalApp[]>> {
    if (page <= 0) throw new BadRequestException();

    const externalApps = await this.prismaService.externalApp.findMany({
      skip: page - 1,
      take: 15,
    });

    return externalApps;
  }

  async update(
    id: string,
    updateExternalAppDto: UpdateExternalAppDto,
  ): Promise<Partial<ExternalApp>> {
    const externalApp = await this.prismaService.externalApp.findUnique({
      where: { id },
    });

    if (!externalApp) {
      throw new NotFoundException(
        'No external apps registered with the provided id.',
      );
    }

    const updatedExternalApp = await this.prismaService.externalApp.update({
      where: { id },
      data: {
        ...updateExternalAppDto,
      },
    });

    return this.prismaService.exclude<
      Partial<ExternalApp>,
      keyof Partial<ExternalApp>
    >(updatedExternalApp, 'ivApiKey', 'apiKey');
  }

  async remove(id: string, res: Response): Promise<void> {
    const externalApp = await this.prismaService.externalApp.findUnique({
      where: { id },
    });

    if (!externalApp) {
      throw new NotFoundException(
        'No external apps registered with the provided id.',
      );
    }

    await this.prismaService.externalApp.delete({
      where: { id },
    });

    res.status(204).json();

    return;
  }

  async generateApiKey(): Promise<ApiKey> {
    const apiKey = v4();
    const encryptedApiKey = await this.encryptData(apiKey);
    const ivApiKey = encryptedApiKey.iv;

    return {
      apiKey,
      ivApiKey,
      encryptedApiKey: encryptedApiKey.encryptedData,
    };
  }

  async encryptData(data: string): Promise<EncryptedData> {
    const bufferData = Buffer.from(data, 'utf-8');
    const iv = randomBytes(16);
    const password = this.configService.get<string>('ENCRYPTION_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedData = Buffer.concat([
      cipher.update(bufferData),
      cipher.final(),
    ]);

    return {
      iv: iv.toString('hex'),
      encryptedData: encryptedData.toString('hex'),
    };
  }

  async decryptData(data: string, iv: string): Promise<string> {
    const bufferIv = Buffer.from(iv, 'hex');
    const bufferData = Buffer.from(data, 'hex');
    const password = this.configService.get<string>('ENCRYPTION_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, bufferIv);

    const decryptedData = Buffer.concat([
      decipher.update(bufferData),
      decipher.final(),
    ]);

    return decryptedData.toString();
  }
}
