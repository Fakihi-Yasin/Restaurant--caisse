import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER')
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  findAll(@CurrentUser() u: { tenantId: string }) {
    return this.users.findAll(u.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() u: { tenantId: string }, @Param('id') id: string) {
    return this.users.findOne(u.tenantId, id);
  }

  @Post()
  create(@CurrentUser() u: { tenantId: string }, @Body() dto: CreateUserDto) {
    return this.users.create(u.tenantId, dto);
  }

  @Patch(':id')
  update(@CurrentUser() u: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(u.tenantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() u: { tenantId: string }, @Param('id') id: string) {
    return this.users.remove(u.tenantId, id);
  }
}
