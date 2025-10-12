import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Tenant ID pode vir do JWT payload (após autenticação)
        const user = request.user;

        if (!user?.tenantId) {
            throw new UnauthorizedException('Tenant não identificado');
        }

        // Adicionar contexto do tenant na request
        request.tenant = {
            tenantId: user.tenantId,
            empresaId: user.empresaPrincipal,
        };

        return true;
    }
}