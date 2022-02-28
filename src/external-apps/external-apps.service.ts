import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKey } from 'src/@types/encryption';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExternalAppDto } from './dto/create-external-app.dto';
import { UpdateExternalAppDto } from './dto/update-external-app.dto';
import { ExternalApp } from './entities/external-app.entity';
import { v4 } from 'uuid';
import { Response } from 'express';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class ExternalAppsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
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
    const encryptedApiKey = await this.encryptionService.encryptData(apiKey);
    const ivApiKey = encryptedApiKey.iv;

    return {
      apiKey,
      ivApiKey,
      encryptedApiKey: encryptedApiKey.encryptedData,
    };
  }
}
