import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginPinDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Owner login (email + password)' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('staff/:tenantSlug')
  @ApiOperation({ summary: 'List active staff for PIN login screen' })
  getStaff(@Param('tenantSlug') slug: string) {
    return this.auth.getStaff(slug);
  }

  @Post('login-pin')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Staff PIN login' })
  loginPin(@Body() dto: LoginPinDto) {
    return this.auth.loginPin(dto);
  }
}
