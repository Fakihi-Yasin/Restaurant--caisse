import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './tenants.dto';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private tenants: TenantsService) {}

  @Get('me')
  getMe(@CurrentUser() user: { tenantId: string }) {
    return this.tenants.getMe(user.tenantId);
  }

  @Patch('me')
  @Roles('OWNER')
  updateMe(@CurrentUser() user: { tenantId: string }, @Body() dto: UpdateTenantDto) {
    return this.tenants.updateMe(user.tenantId, dto);
  }
}
