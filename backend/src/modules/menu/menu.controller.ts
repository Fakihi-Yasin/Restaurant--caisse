import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MenuService } from './menu.service';
import {
  CreateCategoryDto, UpdateCategoryDto,
  CreateProductDto, UpdateProductDto, UpdateAvailabilityDto,
  CreateModifierGroupDto, UpdateModifierGroupDto,
} from './menu.dto';

@ApiTags('menu')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu')
export class MenuController {
  constructor(private menu: MenuService) {}

  // Public menu tree — all roles
  @Get()
  getMenu(@CurrentUser() u: { tenantId: string }) {
    return this.menu.getMenu(u.tenantId);
  }

  // Categories
  @Get('categories')
  @Roles('OWNER')
  getCategories(@CurrentUser() u: { tenantId: string }) {
    return this.menu.getCategories(u.tenantId);
  }

  @Post('categories')
  @Roles('OWNER')
  createCategory(@CurrentUser() u: { tenantId: string }, @Body() dto: CreateCategoryDto) {
    return this.menu.createCategory(u.tenantId, dto);
  }

  @Patch('categories/:id')
  @Roles('OWNER')
  updateCategory(@CurrentUser() u: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.menu.updateCategory(u.tenantId, id, dto);
  }

  @Delete('categories/:id')
  @Roles('OWNER')
  deleteCategory(@CurrentUser() u: { tenantId: string }, @Param('id') id: string) {
    return this.menu.deleteCategory(u.tenantId, id);
  }

  // Products
  @Get('products')
  @Roles('OWNER')
  getProducts(@CurrentUser() u: { tenantId: string }) {
    return this.menu.getProducts(u.tenantId);
  }

  @Post('products')
  @Roles('OWNER')
  createProduct(@CurrentUser() u: { tenantId: string }, @Body() dto: CreateProductDto) {
    return this.menu.createProduct(u.tenantId, dto);
  }

  @Patch('products/:id')
  @Roles('OWNER')
  updateProduct(@CurrentUser() u: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.menu.updateProduct(u.tenantId, id, dto);
  }

  @Patch('products/:id/availability')
  @Roles('OWNER', 'CASHIER')
  updateAvailability(@CurrentUser() u: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.menu.updateAvailability(u.tenantId, id, dto);
  }

  @Delete('products/:id')
  @Roles('OWNER')
  deleteProduct(@CurrentUser() u: { tenantId: string }, @Param('id') id: string) {
    return this.menu.deleteProduct(u.tenantId, id);
  }

  // Modifier groups
  @Get('modifier-groups')
  @Roles('OWNER')
  getModifierGroups(@CurrentUser() u: { tenantId: string }) {
    return this.menu.getModifierGroups(u.tenantId);
  }

  @Post('modifier-groups')
  @Roles('OWNER')
  createModifierGroup(@CurrentUser() u: { tenantId: string }, @Body() dto: CreateModifierGroupDto) {
    return this.menu.createModifierGroup(u.tenantId, dto);
  }

  @Patch('modifier-groups/:id')
  @Roles('OWNER')
  updateModifierGroup(@CurrentUser() u: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdateModifierGroupDto) {
    return this.menu.updateModifierGroup(u.tenantId, id, dto);
  }

  @Delete('modifier-groups/:id')
  @Roles('OWNER')
  deleteModifierGroup(@CurrentUser() u: { tenantId: string }, @Param('id') id: string) {
    return this.menu.deleteModifierGroup(u.tenantId, id);
  }
}
