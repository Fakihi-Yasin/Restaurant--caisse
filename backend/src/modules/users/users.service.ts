import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import * as argon2 from 'argon2';

const SAFE_SELECT = {
  id: true, tenantId: true, name: true, role: true,
  email: true, active: true, createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.user.findMany({ where: { tenantId }, select: SAFE_SELECT, orderBy: { name: 'asc' } });
  }

  async findOne(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, tenantId }, select: SAFE_SELECT });
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(tenantId: string, dto: CreateUserDto) {
    const data: Record<string, unknown> = { tenantId, name: dto.name, role: dto.role, email: dto.email };
    if (dto.password) data.passwordHash = await argon2.hash(dto.password);
    if (dto.pin) data.pinHash = await argon2.hash(dto.pin);
    return this.prisma.user.create({ data: data as never, select: SAFE_SELECT });
  }

  async update(tenantId: string, id: string, dto: UpdateUserDto) {
    await this.findOne(tenantId, id);
    const data: Record<string, unknown> = { name: dto.name, role: dto.role, email: dto.email, active: dto.active };
    if (dto.password) data.passwordHash = await argon2.hash(dto.password);
    if (dto.pin) data.pinHash = await argon2.hash(dto.pin);
    // remove undefined keys
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    return this.prisma.user.update({ where: { id }, data: data as never, select: SAFE_SELECT });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.user.update({ where: { id }, data: { active: false }, select: SAFE_SELECT });
  }
}
