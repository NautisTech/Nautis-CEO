import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user } = request;
        const now = Date.now();

        const userInfo = user ? `User: ${user.username} (Tenant: ${user.tenantId})` : 'Anonymous';

        this.logger.log(
            `→ ${method} ${url} | ${userInfo}`,
        );

        if (Object.keys(body || {}).length > 0 && process.env.NODE_ENV === 'development') {
            this.logger.debug(`Body: ${JSON.stringify(body)}`);
        }

        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - now;
                    this.logger.log(
                        `← ${method} ${url} | ${responseTime}ms`,
                    );
                },
                error: (error) => {
                    const responseTime = Date.now() - now;
                    this.logger.error(
                        `← ${method} ${url} | ${responseTime}ms | ERROR: ${error.message}`,
                    );
                },
            }),
        );
    }
}