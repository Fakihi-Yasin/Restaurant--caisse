import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Wraps all responses in { data, statusCode }
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T; statusCode: number }> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ data: T; statusCode: number }> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(map((data) => ({ statusCode, data })));
  }
}
