import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// Placeholder — full JWT strategy implemented in Step 2
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
