import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, LoginPinDto } from './auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, active: true },
    });
    if (!user?.passwordHash) throw new UnauthorizedException('Identifiants invalides');
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');
    return { token: this.sign(user.id, user.tenantId, user.role), user: this.safeUser(user) };
  }

  async getStaff(tenantSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) throw new NotFoundException('Restaurant introuvable');
    return this.prisma.user.findMany({
      where: { tenantId: tenant.id, active: true },
      select: { id: true, name: true, role: true },
      orderBy: { name: 'asc' },
    });
  }

  async loginPin(dto: LoginPinDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: dto.tenantSlug } });
    if (!tenant) throw new NotFoundException('Restaurant introuvable');
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, tenantId: tenant.id, active: true },
    });
    if (!user?.pinHash) throw new UnauthorizedException('PIN invalide');
    const valid = await argon2.verify(user.pinHash, dto.pin);
    if (!valid) throw new UnauthorizedException('PIN invalide');
    return { token: this.sign(user.id, user.tenantId, user.role), user: this.safeUser(user) };
  }

  private sign(userId: string, tenantId: string, role: string) {
    return this.jwt.sign({ sub: userId, tenantId, role });
  }

  private safeUser(user: { id: string; name: string; role: string; tenantId: string }) {
    return { id: user.id, name: user.name, role: user.role, tenantId: user.tenantId };
  }
}
