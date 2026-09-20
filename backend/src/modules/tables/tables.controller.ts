import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TablesService } from './tables.service';
import { CreateTableDto, UpdateTableDto } from './tables.dto';

@ApiTags('tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tables')
export class TablesController {
  constructor(private tables: TablesService) {}

  @Get()
  findAll(@CurrentUser() u: { tenantId: string }) {
    return this.tables.findAll(u.tenantId);
  }

  @Post()
  @Roles('OWNER')
  create(@CurrentUser() u: { tenantId: string }, @Body() dto: CreateTableDto) {
    return this.tables.create(u.tenantId, dto);
  }

  @Patch(':id')
  @Roles('OWNER')
  update(@CurrentUser() u: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.tables.update(u.tenantId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  remove(@CurrentUser() u: { tenantId: string }, @Param('id') id: string) {
    return this.tables.remove(u.tenantId, id);
  }
}
