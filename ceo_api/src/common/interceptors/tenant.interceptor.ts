import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Adicionar informações do tenant no request
        if (user?.tenantId) {
            request.tenantContext = {
                tenantId: user.tenantId,
                empresaId: user.empresaPrincipal,
            };
        }

        return next.handle();
    }
}