import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCategoryDto, UpdateCategoryDto,
  CreateProductDto, UpdateProductDto, UpdateAvailabilityDto,
  CreateModifierGroupDto, UpdateModifierGroupDto,
} from './menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // ---------- Public menu tree ----------
  getMenu(tenantId: string) {
    return this.prisma.category.findMany({
      where: { tenantId, active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          where: { available: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            modifierGroups: {
              include: {
                group: {
                  include: { modifiers: { orderBy: { sortOrder: 'asc' } } },
                },
              },
            },
          },
        },
      },
    });
  }

  // ---------- Categories ----------
  getCategories(tenantId: string) {
    return this.prisma.category.findMany({ where: { tenantId }, orderBy: { sortOrder: 'asc' } });
  }

  createCategory(tenantId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { tenantId, ...dto } });
  }

  async updateCategory(tenantId: string, id: string, dto: UpdateCategoryDto) {
    await this.assertCategory(tenantId, id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async deleteCategory(tenantId: string, id: string) {
    await this.assertCategory(tenantId, id);
    return this.prisma.category.delete({ where: { id } });
  }

  // ---------- Products ----------
  getProducts(tenantId: string) {
    return this.prisma.product.findMany({ where: { tenantId }, orderBy: { sortOrder: 'asc' } });
  }

  createProduct(tenantId: string, dto: CreateProductDto) {
    return this.prisma.product.create({ data: { tenantId, ...dto } });
  }

  async updateProduct(tenantId: string, id: string, dto: UpdateProductDto) {
    await this.assertProduct(tenantId, id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async updateAvailability(tenantId: string, id: string, dto: UpdateAvailabilityDto) {
    await this.assertProduct(tenantId, id);
    return this.prisma.product.update({ where: { id }, data: { available: dto.available } });
  }

  async deleteProduct(tenantId: string, id: string) {
    await this.assertProduct(tenantId, id);
    return this.prisma.product.delete({ where: { id } });
  }

  // ---------- Modifier groups ----------
  getModifierGroups(tenantId: string) {
    return this.prisma.modifierGroup.findMany({
      where: { tenantId },
      include: { modifiers: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  createModifierGroup(tenantId: string, dto: CreateModifierGroupDto) {
    const { modifiers, ...rest } = dto;
    return this.prisma.modifierGroup.create({
      data: {
        tenantId, ...rest,
        modifiers: modifiers ? { create: modifiers } : undefined,
      },
      include: { modifiers: true },
    });
  }

  async updateModifierGroup(tenantId: string, id: string, dto: UpdateModifierGroupDto) {
    await this.assertModifierGroup(tenantId, id);
    return this.prisma.modifierGroup.update({ where: { id }, data: dto });
  }

  async deleteModifierGroup(tenantId: string, id: string) {
    await this.assertModifierGroup(tenantId, id);
    return this.prisma.modifierGroup.delete({ where: { id } });
  }

  // ---------- Guards ----------
  private async assertCategory(tenantId: string, id: string) {
    const c = await this.prisma.category.findFirst({ where: { id, tenantId } });
    if (!c) throw new NotFoundException('Category not found');
  }

  private async assertProduct(tenantId: string, id: string) {
    const p = await this.prisma.product.findFirst({ where: { id, tenantId } });
    if (!p) throw new NotFoundException('Product not found');
  }

  private async assertModifierGroup(tenantId: string, id: string) {
    const g = await this.prisma.modifierGroup.findFirst({ where: { id, tenantId } });
    if (!g) throw new NotFoundException('ModifierGroup not found');
  }
}
