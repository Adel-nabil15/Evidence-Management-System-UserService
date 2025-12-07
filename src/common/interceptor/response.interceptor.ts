
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
            return next
            .handle()
            .pipe(
                map((data) => ({
                    success: true,
                    data,
                    timestamp: new Date().toISOString(),
                })),
                    
            );
    }
}
