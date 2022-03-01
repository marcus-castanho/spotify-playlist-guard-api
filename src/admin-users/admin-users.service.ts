import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    adminKey: string,
    createAdminUserDto: CreateAdminUserDto,
  ): Promise<AdminUser> {
    const appAdminKey = this.configService.get<string>('ADMIN_KEY');

    if (adminKey !== appAdminKey) {
      throw new ForbiddenException();
    }

    const { email } = createAdminUserDto;
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: { email },
    });

    if (adminUser) {
      throw new ConflictException('The email provided is already registered.');
    }

    const newAdminUser = await this.prismaService.adminUser.create({
      data: {
        ...createAdminUserDto,
      },
    });

    return this.prismaService.exclude<AdminUser, keyof AdminUser>(
      newAdminUser,
      'password',
    );
  }

  async listPage(page: number): Promise<AdminUser[]> {
    if (page <= 0) throw new BadRequestException();

    const adminUsers = await this.prismaService.adminUser.findMany({
      skip: page - 1,
      take: 15,
    });

    return adminUsers.map((adminUser) =>
      this.prismaService.exclude<Partial<AdminUser>, keyof Partial<AdminUser>>(
        adminUser,
        'password',
      ),
    );
  }

  async findOneByEmail(email: string): Promise<AdminUser> {
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser) {
      throw new NotFoundException(
        'No admin user registered with the provided email.',
      );
    }

    return adminUser;
  }

  async findOne(id: string): Promise<AdminUser> {
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: { id },
    });

    if (!adminUser) {
      throw new NotFoundException(
        'No admin user registered with the provided od.',
      );
    }

    return this.prismaService.exclude<AdminUser, keyof AdminUser>(
      adminUser,
      'password',
    );
  }

  async update(
    id: string,
    updateAdminUserDto: UpdateAdminUserDto,
  ): Promise<AdminUser> {
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: { id },
    });

    if (!adminUser) {
      throw new NotFoundException(
        'No admin user registered with the provided id.',
      );
    }

    const newAdminUser = await this.prismaService.adminUser.update({
      where: { id },
      data: {
        ...updateAdminUserDto,
      },
    });

    return this.prismaService.exclude<AdminUser, keyof AdminUser>(
      newAdminUser,
      'password',
    );
  }

  async remove(id: string, res: Response): Promise<void> {
    const adminUser = await this.prismaService.adminUser.findUnique({
      where: { id },
    });

    if (!adminUser) {
      throw new NotFoundException(
        'No admin user registered with the provided id.',
      );
    }

    await this.prismaService.adminUser.delete({
      where: { id },
    });

    res.status(204).json();

    return;
  }
}
