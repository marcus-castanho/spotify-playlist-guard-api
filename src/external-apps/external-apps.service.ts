import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExternalAppDto } from './dto/create-external-app.dto';
import { UpdateExternalAppDto } from './dto/update-external-app.dto';
import { ExternalApp } from './entities/external-app.entity';
import { v4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class ExternalAppsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createExternalAppDto: CreateExternalAppDto,
  ): Promise<ExternalApp> {
    const { baseUrl } = createExternalAppDto;

    const externalApp = await this.prismaService.externalApp.findUnique({
      where: { baseUrl },
    });

    if (externalApp) {
      throw new ConflictException(
        'The baseUrl provided is already registered.',
      );
    }

    const apiKey = v4();

    const newExternalApp = await this.prismaService.externalApp.create({
      data: {
        apiKey,
        ...createExternalAppDto,
      },
    });

    return {
      apiKey,
      ...this.prismaService.exclude<ExternalApp, keyof ExternalApp>(
        newExternalApp,
        'apiKey',
      ),
    };
  }

  async findOne(id: string): Promise<ExternalApp> {
    const externalApp = await this.prismaService.externalApp.findUnique({
      where: { id },
    });

    if (!externalApp) {
      throw new NotFoundException(
        'No external apps registered with the provided id.',
      );
    }

    return externalApp;
  }

  async listPage(page: number): Promise<ExternalApp[]> {
    if (page <= 0) throw new BadRequestException();

    const externalApps = await this.prismaService.externalApp.findMany({
      skip: page - 1,
      take: 15,
    });

    return externalApps.map((externalApp) => {
      return this.prismaService.exclude<ExternalApp, keyof ExternalApp>(
        externalApp,
        'apiKey',
      );
    });
  }

  async update(
    id: string,
    updateExternalAppDto: UpdateExternalAppDto,
  ): Promise<ExternalApp> {
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

    return this.prismaService.exclude<ExternalApp, keyof ExternalApp>(
      updatedExternalApp,
      'apiKey',
    );
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
}
