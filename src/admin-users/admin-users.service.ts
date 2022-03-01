import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  ): Promise<Partial<AdminUser>> {
    const appAdminKey = this.configService.get<string>('ADMIN_KEY');

    console.log(adminKey, appAdminKey);
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

    return this.prismaService.exclude<
      Partial<AdminUser>,
      keyof Partial<AdminUser>
    >(newAdminUser, 'password');
  }

  // findAll() {
  //   return `This action returns all adminUsers`;
  // }

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

  // update(id: number, updateAdminUserDto: UpdateAdminUserDto) {
  //   return `This action updates a #${id} adminUser`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} adminUser`;
  // }
}
