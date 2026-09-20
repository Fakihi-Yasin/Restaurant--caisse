import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto, UpdateTableDto } from './tables.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.diningTable.findMany({
      where: { tenantId, active: true },
      orderBy: [{ zone: 'asc' }, { name: 'asc' }],
    });
  }

  create(tenantId: string, dto: CreateTableDto) {
    return this.prisma.diningTable.create({ data: { tenantId, ...dto } });
  }

  async update(tenantId: string, id: string, dto: UpdateTableDto) {
    await this.assert(tenantId, id);
    return this.prisma.diningTable.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.assert(tenantId, id);
    return this.prisma.diningTable.update({ where: { id }, data: { active: false } });
  }

  private async assert(tenantId: string, id: string) {
    const t = await this.prisma.diningTable.findFirst({ where: { id, tenantId } });
    if (!t) throw new NotFoundException('Table not found');
  }
}
